import { chromium, type Page } from 'playwright';
import { detectHumanBlockers } from '@/lib/applicationAnswers';

export type ApplicantFields = { firstName:string; lastName:string; email:string; phone:string; address?:string; linkedIn?:string };
const fieldSelectors: Record<keyof ApplicantFields,string[]> = {
  firstName:['input[name*=first i]','input[id*=first i]'], lastName:['input[name*=last i]','input[id*=last i]'],
  email:['input[type=email]','input[name*=email i]'], phone:['input[type=tel]','input[name*=phone i]'],
  address:['input[name*=address i]','input[id*=address i]'], linkedIn:['input[name*=linkedin i]','input[id*=linkedin i]']
};
async function fillFirst(page: Page, selectors:string[], value?:string) {
  if (!value) return false;
  for (const selector of selectors) { const locator=page.locator(selector).first(); if(await locator.count()){await locator.fill(value);return true;} }
  return false;
}
export async function runAssistedApplication(url:string, fields:ApplicantFields) {
  if (!/^https:\/\//.test(url)) throw new Error('Only HTTPS application URLs are allowed');
  const browser = await chromium.launch({headless:false});
  const page = await browser.newPage(); await page.goto(url,{waitUntil:'domcontentloaded'});
  const filled:string[]=[];
  for (const key of Object.keys(fieldSelectors) as (keyof ApplicantFields)[]) if(await fillFirst(page,fieldSelectors[key],fields[key])) filled.push(key);
  const blockers=detectHumanBlockers(await page.locator('body').innerText());
  return {browser,page,filled,blockers,status:blockers.length?'NEEDS_HUMAN':'NEEDS_REVIEW' as const};
}
