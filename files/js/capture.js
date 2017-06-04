document.getElementById("file").onchange = function() {
    var reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("video").src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
};
var v = document.getElementById("video");
var c = document.getElementById("myCanvas");
var image = document.getElementById("gifimage");
var download = document.getElementById("download");
var ctx = c.getContext("2d");
var encoder = new GIFEncoder();
encoder.setRepeat(0);
encoder.setDelay(0);
var i;

function startcapture() {
    encoder.start();
    i = window.setInterval(function() {
        ctx.drawImage(v, 0, 0, 300, 150);
        encoder.addFrame(ctx)
    }, 1);
}

function stopcapture() {
    encoder.finish();
    download.href = 'data:image/gif;base64,' + encode64(encoder.stream().getData());
    image.src = 'data:image/gif;base64,' + encode64(encoder.stream().getData());
    window.clearInterval(i);
}
download.addEventListener("click", function() {
    console.log(download);
})
v.addEventListener("ended", function() {
    clearInterval(i);
}, false);