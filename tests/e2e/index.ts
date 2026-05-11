import { chromium } from "playwright";
import * as fs from "fs";
import * as yaml from "js-yaml";

import { ActionHandlers } from './action-handlers';
import { FormConfig } from './types';

const yamlRoute = 'tests/e2e/appointments/complete-appointment.yaml'

async function runAutoFiller() {
    const configFile =
        process.argv[2] && process.argv[2].endsWith('.yaml')
            ? process.argv[2]
            : process.argv[3] || yamlRoute;
    if (!fs.existsSync(configFile)) {
        console.error(`Error: could not find the file "${configFile}"`);
        process.exit(1);
    }

    console.log(`Reading ${configFile}...`);
    const fileContents = fs.readFileSync(configFile, 'utf8');
    const config = yaml.load(fileContents) as FormConfig;

    const browser = await chromium.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();
    await page.goto(config.url);

    // Execution loop
    for (const step of config.steps) {
        const target = 'selector' in step ? step.selector : 'value' in step ? step.value : '';

        console.log(`Executing [${step.action}] on: ${target}`);

        const handlerFunction = ActionHandlers[step.action as keyof typeof ActionHandlers];

        if (handlerFunction) {
            await handlerFunction(page, step as any);
        } else {
            console.error(`Unknown action type: ${step.action}`);
        }
    }

    console.log('All steps completed successfully: keeping browser open...');
}

runAutoFiller().catch(console.error);
