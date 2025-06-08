import {renderRequest, callAction} from '@parcel/rsc/server';
import {Page} from './pages/index';

import { Hono } from 'hono';

let app = new Hono();

app.get('/', (c) => {
  return renderRequest(c.req.raw, <Page req={c.req} />, {component: Page});
});

app.post('/', async (c) => {
  let id = c.req.header('rsc-action-id');
  let result = await callAction(c.req.raw, id);
  let root: any = <Page req={c.req} />;
  if (id) {
    root = {result, root};
  }
  return renderRequest(c.req.raw, root, {component: Page});
})

app.all('*', (c) => {
  if (c.req.url === '/') {
    return new Response('Unknown method', {status: 500});
  }
  return new Response('Not found', {status: 404});
});

export default app;


// export default {
//   async fetch(req: Request) {
//     const pathname = new URL(req.url).pathname;
//     if (pathname === '/') {
//       if (req.method === 'GET') {
//         return renderRequest(req, <Page />, {component: Page});
//       } else if (req.method === 'POST') {
//         let id = req.headers.get('rsc-action-id');
//         let result = await callAction(req, id);
//         let root: any = <Page />;
//         if (id) {
//           root = {result, root};
//         }
//         return renderRequest(req, root, {component: Page});
//       } else {
//         return new Response('Unknown method', {status: 500});
//       }
//     } else {
//       return new Response('Not found', {status: 404});
//     }
//   }
// };