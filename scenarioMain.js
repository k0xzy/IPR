import { group } from 'k6';
import UC01_createFolder from './UC01_createFolder.js';
import UC02_emptyTrash from './UC02_emptyTrash.js';
import UC03_sendMessage from './UC03_sendMessage.js';

export let options = {
    scenarios: {
      constant_request_rate: {
        executor: 'constant-arrival-rate',
        rate: 20,
        timeUnit: '1h',
        duration: '1h',
        preAllocatedVUs: 2,
        maxVUs: 2,
      }
    }
  };
  



export default function () {
    // group('Folders+', () => {
    //     UC01_createFolder();
    // });
    // group('Trash+', () => {
    //     UC02_emptyTrash();
    // });
    group('SendMessage+', () => {
        UC03_sendMessage();
    });
}
