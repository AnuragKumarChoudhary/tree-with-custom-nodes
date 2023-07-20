d3.selectAll(".expand-button").on("click", function (d) {
    console.log(d);
    if (d.srcElement.classList[0] == "node-name") {
        d3.selectAll(".node-details")._groups[0].forEach(element => {
            if (element.getAttribute("class").includes(d.srcElement.classList[2])) {
                element.classList.toggle("node-details-hidden")
            }
        });
    } else {
        d3.selectAll(".description")._groups[0].forEach(element => {
            if (element.getAttribute("class").includes(d.srcElement.classList[1])) {
                element.classList.toggle("description-hidden")
            }
        });
        d3.selectAll(".link-source")._groups[0].forEach(element => {
            if (element.getAttribute("class").includes(d.srcElement.classList[1])) {
                element.classList.toggle("link-source-expanded")
            }
        });
    }
    setTimeout(() => {
        drawPaths();
    }, 500);

});

function drawPaths() {
    document.querySelectorAll("path").forEach(e => {
        e.parentElement.removeChild(e);
    })
    let visualContainerX = document.querySelector(".visualisation_container").getBoundingClientRect().x,
        visualContainerY = document.querySelector(".visualisation_container").getBoundingClientRect().y,
        nodeX, nodeY;
    let sourceX, sourceY, sourceWidth, sourceHeight, sourceIndex;
    let targetX, targetY, targetWidth, targetHeight, targetIndex;

    console.log(document.querySelector(".visualisation_container").getBoundingClientRect());

    d3.select("svg").attr("height", document.querySelector(".visualisation_container").getBoundingClientRect().height)
        .attr("width", document.querySelector(".visualisation_container").getBoundingClientRect().width)
        .attr("x", 0)
        .attr("y", 0)
        .style("pointer-events", "none")
        .style("position", "absolute")


    let paths = {
        "sources": [],
        "targets": []
    }
    document.querySelectorAll(".link-source").forEach(element => {
        if (element.getAttribute("class").split(" ")[1].split("")[0] == 0) {
            sourceX = element.getBoundingClientRect().x - visualContainerX;
            sourceY = element.getBoundingClientRect().y - visualContainerY;
            sourceWidth = element.getBoundingClientRect().width;
            sourceHeight = element.getBoundingClientRect().height;
            sourceIndex = element.getAttribute("class").split(" ")[1].split("")[1];

            paths["sources"].push({
                "x": sourceX,
                "y": sourceY,
                "width": sourceWidth,
                "height": sourceHeight,
                "index": sourceIndex
            })
        } else if (element.getAttribute("class").split(" ")[1].split("")[0] == 1) {
            targetX = element.getBoundingClientRect().x - visualContainerX;
            targetY = element.getBoundingClientRect().y - visualContainerY;
            targetWidth = element.getBoundingClientRect().width;
            targetHeight = element.getBoundingClientRect().height;
            targetIndex = element.getAttribute("class").split(" ")[1].split("")[1];

            paths["targets"].push({
                "x": targetX,
                "y": targetY,
                "width": targetWidth,
                "height": targetHeight,
                "index": targetIndex
            })
        }
    })
    for (let i = 0; i < paths.sources.length; i++) {
        d3.select("svg").append("path")
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("fill", "none")
            .attr("d", d => {
                // let path = `M ${paths.sources[i].x + paths.sources[i].width} ${paths.sources[i].y + (paths.sources[i].height / 2)} L${paths.sources[i].x + paths.sources[i].width + 50 - (paths.sources[i].index * 10)} ${paths.sources[i].y + (paths.sources[i].height / 2)} V${paths.sources[i].y + (paths.sources[i].height / 2)} ${paths.targets[i].y + (paths.targets[i].height / 2)} L${paths.targets[i].x - 300} ${paths.targets[i].y + (paths.targets[i].height / 2)}`;
                let path = `M ${paths.sources[i].x + paths.sources[i].width} ${paths.sources[i].y + 15} L${paths.sources[i].x + paths.sources[i].width + 50 - (paths.sources[i].index * 10)} ${paths.sources[i].y + 15} V${paths.sources[i].y + 15} ${paths.targets[i].y + 15} L${paths.targets[i].x - 300} ${paths.targets[i].y + 15}`;
                return path;
            })
    }
}

drawPaths()
window.addEventListener("resize", function () {
    drawPaths();
})