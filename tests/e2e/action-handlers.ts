import { Page } from 'playwright';
import { StepConfig } from './types';

export const ActionHandlers = {
    goto: async (page: Page, step: Extract<StepConfig, { action: 'goto' }>) => {
        await page.goto(step.value);
    },

    expectText: async (page: Page, step: Extract<StepConfig, { action: 'expectText' }>) => {
        const element = page.getByText(step.value, { exact: false });
        await element.waitFor({ state: 'visible', timeout: 5000 });
    },
    expectUrl: async (page: Page, step: Extract<StepConfig, { action: 'expectUrl' }>) => {
        await page.waitForURL((url) => url.pathname === step.value, {
            timeout: 5000,
        });
    },

    fill: async (page: Page, step: Extract<StepConfig, { action: 'fill' }>) => {
        const input = page.locator(`
          input[name="${step.selector}"], 
          textarea[name="${step.selector}"],
          input[aria-label="${step.selector}"],
          input[placeholder="${step.selector}"]
        `);
        await input.fill(step.value);
    },

    autocomplete: async (page: Page, step: Extract<StepConfig, { action: 'autocomplete' }>) => {
        const input = page.getByRole('combobox', { name: step.selector });
        await input.click();
        await input.fill(step.value);
        await page.waitForTimeout(300);
        await page.getByRole('option', { name: step.value }).click();
        await page.keyboard.press('Escape');
    },

    click: async (page: Page, step: Extract<StepConfig, { action: 'click' }>) => {
        const target = page
            .locator(
                `
        button:has-text("${step.selector}"), 
        a:has-text("${step.selector}"), 
        label:has-text("${step.selector}"),
        span:has-text("${step.selector}")
      `,
            )
            .first();

        await target.waitFor({ state: 'visible', timeout: 5000 });
        await target.click();
    },

    clickRow: async (page: Page, step: Extract<StepConfig, { action: 'clickRow' }>) => {
        const row = page.locator(`[role="row"]`).filter({ hasText: step.selector }).first();
        await row.waitFor({ state: 'visible', timeout: 5000 });
        await row.click();
    },

    date: async (page: Page, step: Extract<StepConfig, { action: 'date' }>) => {
        const input = page.locator('label').filter({ hasText: step.selector }).locator('..').locator('input');

        await input.waitFor({ state: 'visible', timeout: 5000 });

        await input.click({ force: true });
        await page.waitForTimeout(200);

        await page.keyboard.press('Control+A');
        await page.keyboard.press('Meta+A');
        await page.keyboard.press('Backspace');

        await page.keyboard.press('Home');
        await page.keyboard.type(step.value, { delay: 150 });

        await page.waitForTimeout(200);
        await page.keyboard.press('Tab');
    },

    select: async (page: Page, step: Extract<StepConfig, { action: 'select' }>) => {
        const combobox = page.getByRole('combobox', { name: step.selector });
        await combobox.waitFor({ state: 'visible', timeout: 5000 });
        await combobox.click();

        const option = page.getByRole('option', {
            name: step.value,
            exact: true,
        });

        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();

        await page.waitForTimeout(400);
    },
};
