<template>
  <div class="page">
    <div class="wrapper">
      <video ref="qrVideo"></video>
      <div>
        <el-button size="small" type="primary">闪光灯</el-button>
      </div>
      <div>
        <input type="file" ref="fileSelector" />
      </div>
    </div>
  </div>
</template>

<script>
// import QrScanner from "qr-scanner"; // if installed via package and bundling with a module bundler like webpack or rollup
// import QrScannerWorkerPath from "!!file-loader!./node_modules/qr-scanner/qr-scanner-worker.min.js";
// import qrScannerWorkerSource from "!!raw-loader!./node_modules/qr-scanner/qr-scanner-worker.min.js";
// import QrScanner from "../qr-scanner.min.js";
// import QrScanner from "qr-scanner";

export default {
  name: "HXscanCode",
  data() {
    return {};
  },
  mounted() {
    const QrScanner = require("qr-scanner");
    const video = this.$refs.qrVideo;
    const fileSelector = this.$refs.fileSelector;
    QrScanner.WORKER_PATH = "../qr-scanner-worker.min.js";
    // QrScannerLib.WORKER_PATH = QrScannerWorkerPath;
    // QrScanner.WORKER_PATH = URL.createObjectURL(
    //   new Blob([qrScannerWorkerSource])
    // );

    const scanner = new QrScanner(video, result =>
      console.log("decoded qr code:", result)
    );
    scanner.start().then(() => {
      scanner.hasFlash().then(hasFlash => {
        // camHasFlash.textContent = hasFlash;
        console.log(hasFlash, "222222222222222222222222");
        if (hasFlash) {
        }
      });
    });

    fileSelector.addEventListener("change", event => {
      const file = fileSelector.files[0];
      if (!file) {
        return;
      }
      QrScanner.scanImage(file)
        .then(result => {
          console.log(result, "111111111111111111111111");
        })
        .catch(e => {
          console.log(e, "22222222222222222222222");
        });
    });
  },
  methods: {
    setResult(label, result) {
      console.log(label, result, "111111111111111111");
      return;
      label.textContent = result;
      camQrResultTimestamp.textContent = new Date().toString();
      label.style.color = "teal";
      clearTimeout(label.highlightTimeout);
      label.highlightTimeout = setTimeout(
        () => (label.style.color = "inherit"),
        100
      );
    }
  }
};
</script>

<style scoped></style>
