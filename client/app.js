const puppeteer = require("puppeteer");
const http = require("http");
const { exec } = require("child_process");

const startWebpackDevServer = () => {
    return new Promise((resolve, reject) => {
        exec("webpack-dev-server");
        const serverCheckTimer = setInterval(() => {
            http.get("http://127.0.0.1:9000/webpack-dev-server/", res => {
                if (res.statusCode === 200) {
                    clearInterval(serverCheckTimer);
                    resolve();
                }
            });
        }, 1000);
    });
};

(async () => {
    await startWebpackDevServer();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:9000/webpack-dev-server/");

    let status = await page.$eval("#status", elm => elm.innerHTML);
    let okness = await page.$eval("#okness", elm => elm.innerHTML);

    console.log(`status: ${status}`);
    console.log(`okness: ${okness}`);

    await browser.close();
})();
