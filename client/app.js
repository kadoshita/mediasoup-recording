const puppeteer = require("puppeteer");
const http = require("http");
const { exec } = require("child_process");

const RETRY_COUNT = 10;

const sleep = msec => {
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
};

(async () => {
    const browser = await puppeteer.launch({
        headless:false
    });
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:9000/webpack-dev-server/");

    let status = "";
    let okness = "";

    let isReady = false;
    for(let retry = 0; retry<RETRY_COUNT;retry++){
        status = await page.$eval("#status", elm => elm.innerHTML);
        okness = await page.$eval("#okness", elm => elm.innerHTML);
        console.log(`retry: ${retry} status: ${status} okness: ${okness}`);
        if(status.toLowerCase()==="app ready."){
            isReady = true;
            break;
        }
        await sleep(1000);
    }

    if(!isReady){
        await browser.close();
    }

    await browser.close();
})();
