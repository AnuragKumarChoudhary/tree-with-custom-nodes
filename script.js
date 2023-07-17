d3.selectAll(".expand-button").on("click", d => {
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

});

document.querySelectorAll(".link-source").forEach(element=>{
    console.log(element.offsetLeft, element.offsetTop);
})