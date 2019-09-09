const puppeteer = require("puppeteer");

const sleep = msec => {
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
};

(async () => {
    let transportsNum=process.argv[2];
    let producersNum=process.argv[3];

    console.log(`transports: ${transportsNum} producers: ${producersNum}`);

    const browser = await puppeteer.launch({
        headless:false,
        timeout: 5000,
        args: [
            "--window-size=412,732",
            "--disable-gpu",
            "--autoplay-policy=no-user-gesture-required",
            "--no-sandbox",
            "--use-fake-ui-for-media-stream",
            "--use-fake-device-for-media-stream"
        ]
    });
    const page = await browser.newPage();
    page.on("pageerror", err => {
        console.error(err);
    });
    page.on("console", msg => {
        console.log(msg.text());
    });

    await page.goto("http://127.0.0.1:8080/",{
        timeout: 5000,
        waitUntil: "load"
    });

    await page.evaluate(transportsNum=>{
        document.getElementById("transports").value=transportsNum;
    },transportsNum);
    await page.evaluate(producersNum=>{
        document.getElementById("producers").value=producersNum;
    },producersNum);
    await sleep(1000);

    await page.click("#capture-start-button");
    await sleep(1000);

    await page.click("#record-start-button");

    await sleep(5000);

    await browser.close();
})();
