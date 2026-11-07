import { test as base, expect } from '@playwright/test';
// Existing scenarios focus on combat after readiness. New progression scenarios
// use the base fixture to explicitly inspect and rearrange the ready screen.
export const test=base.extend({page:async({page},use)=>{
  await page.addLocatorHandler(page.locator('#prebattle-dialog [data-start-battle]'),async button=>{await button.click();});
  await use(page);
}});
export {expect};
