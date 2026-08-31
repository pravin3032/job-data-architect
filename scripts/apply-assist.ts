import { readFile } from 'node:fs/promises';
import { runAssistedApplication } from '@/server/applications/runner';
const url=process.argv.find(x=>x.startsWith('--url='))?.slice(6);
const profilePath=process.argv.find(x=>x.startsWith('--profile='))?.slice(10)??'private/applicant.json';
if(!url) throw new Error('Usage: npm run apply:assist -- --url=https://... [--profile=private/applicant.json]');
const fields=JSON.parse(await readFile(profilePath,'utf8'));
const result=await runAssistedApplication(url,fields);
console.log(JSON.stringify({filled:result.filled,blockers:result.blockers,status:result.status},null,2));
console.log('Browser remains open. Review every answer; complete CAPTCHA/MFA/attestation yourself; submit only after approval.');
