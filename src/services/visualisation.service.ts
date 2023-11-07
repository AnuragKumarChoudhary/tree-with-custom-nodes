import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {

  constructor() { }

  generateExpandableTree(selector: string, data: any, showLinkText: boolean = true) {

    let w = window,
      d = document,
      e = d.documentElement,
      wg = d.getElementsByTagName('body')[0],
      wx = w.innerWidth || e.clientWidth || wg.clientWidth,
      wy = w.innerHeight || e.clientHeight || wg.clientHeight;


    document.querySelectorAll("svg").forEach((e: any) => {
      e.parentElement.removeChild(e);
    })

    const nodedata = data["nodes"];
    const linkData = data["links"]


    let conatinerWidth: number = document.querySelector(selector)!.getBoundingClientRect().width,
      containerHeight: number = document.querySelector(selector)!.getBoundingClientRect().height;

    let svg: any = d3.select(selector).append("svg")
      .attr("height", containerHeight)
      .attr("width", conatinerWidth);

    let g = svg.append("g").attr("class", "graph");

    let filter = svg.append("defs")
      .append("filter")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 1)
      .attr("height", 1)
      .attr("id", "background")
      .append("feFlood")
      .attr("flood-color", "white")
      .attr("result", "bg")
      .append("feMerge")
      .append("feMergeNode")
      .attr("in", "bg")
      .append("feMergeNode")
      .attr("in", "SourceGraphic")


    let zoom = d3.zoom().on("zoom", handleZoom).scaleExtent([0.4, 1])

    function handleZoom(e: any) {
      d3.select("g.graph").attr("transform", e.transform)
    }

    zoom(svg);

    for (let i = 0; i < nodedata.length; i++) {
      g.append("g")
        .attr("transform", (d: any) => {
          return "translate(20, 20)";
        })
        .append("foreignObject")
        .attr("height", "40")
        .attr("width", "40")
        .attr("x", (nodedata[i]["grid_position"][0] * 600))
        .attr("y", () => {
          let yPosition;
          if (i == 0) {
            yPosition = 0;
          } else {
            let n = document.querySelector(`#${nodedata[i - 1]["id"]}`)?.getBoundingClientRect()
            yPosition = ((n!.y + n!.height + 100) * nodedata[i]["grid_position"][1]);
          }

          return yPosition;
        })
        .style("overflow", "visible")
        .html(() => {
          let nodeHTML = `
          <div class="node-container" id="${nodedata[i]["id"]}">
          <div class="node-title"><i class="material-icons">${nodedata[i]["icon"]}</i><span>${nodedata[i]["name"]}</span></div>`

          for (let k = 0; k < nodedata[i]["level_1"].length; k++) {
            nodeHTML += `<div class="node-body">
            <div class="node-name"><span class="node-icon">000</span><span class="name">${nodedata[i]["level_1"][k]["name"]}</span><i class="material-icons">remove</i></div>
            <div class="sub-node-container">`
            console.log(nodedata[i]["level_1"][k]);

            for (let j = 0; j < nodedata[i]["level_1"][k]["level_2"].length; j++) {
              nodeHTML += `<div class="sub-node">
            <div class="sub-node-name" id="${nodedata[i]["level_1"][k]["level_2"][j]["id"]}"><span class="name">${nodedata[i]["level_1"][k]["level_2"][j]["name"]}</span><span><i class="material-icons" id="${nodedata[i]["level_1"][k]["level_2"][j]["id"]}">add</i></span></div>
            <div class="sub-node-desc sub-node-desc-hidden" id="${nodedata[i]["level_1"][k]["level_2"][j]["id"]}-desc">${nodedata[i]["level_1"][k]["level_2"][j]["Description"]}</div>
          </div>`
            }
            nodeHTML += `</div></div>`
          }

          nodeHTML += `</div>`
          return nodeHTML;
        })
    }


    d3.selectAll(".sub-node-name i").on("click", (event) => {
      console.log(event);
      document.querySelectorAll(".sub-node-desc").forEach(e => {
        console.log(e.id, event.target.id + "-desc");
        if (e.id != event.target.id + "-desc") {
          e!.classList.add("sub-node-desc-hidden");
        }
      })
      document.querySelector(`#${event.target.id}-desc`)!.classList.toggle("sub-node-desc-hidden");
      createLink();
    })

    createLink();

    function createLink() {
      document.querySelectorAll(".link-container").forEach((e: any) => {
        e.parentElement.removeChild(e);
      })

      for (let i = 0; i < linkData.length; i++) {
        console.log(`${linkData[i]["source"].split("-")[0]}`)
        // console.log(nodedata.filter((item: any) => item));
        // let linkOffset = (nodedata.filter((item: any) => item.id.toLowerCase().includes(`${linkData[i]["source"].split("-")[0]}`))[0].grid_position[1])+1 * 10;
        // let linkOffset = i*5;
        console.log(linkData[i]);
        let source = document.querySelector(`#${linkData[i]["source"]}`)?.parentElement!.getBoundingClientRect();
        let target = document.querySelector(`#${linkData[i]["target"]}`)?.parentElement!.getBoundingClientRect();
        console.log(target);

        let graph = document.querySelector(`g.graph`)?.getBoundingClientRect();
        let relSrcX = (source!.x - document.querySelector(`g.graph`)!.getBoundingClientRect()!.x);
        let relSrcY = (source!.y - document.querySelector(`g.graph`)!.getBoundingClientRect()!.y);
        let relTarX = (target!.x - document.querySelector(`g.graph`)!.getBoundingClientRect()!.x);
        let relTarY = (target!.y - document.querySelector(`g.graph`)!.getBoundingClientRect()!.y);
        let relSrcWidth = source!.width;

        if (document.querySelector("g.graph")!.getAttribute("transform")) {
          console.log(100 / parseFloat(document.querySelector("g.graph")!.getAttribute("transform")!.toString().split(" ")[1].split("(")[1].split(")")[0]));
          relSrcX = relSrcX * (1 / parseFloat(document.querySelector("g.graph")!.getAttribute("transform")!.toString().split(" ")[1].split("(")[1].split(")")[0]))
          relSrcY = relSrcY * (1 / parseFloat(document.querySelector("g.graph")!.getAttribute("transform")!.toString().split(" ")[1].split("(")[1].split(")")[0]))
          relTarX = relTarX * (1 / parseFloat(document.querySelector("g.graph")!.getAttribute("transform")!.toString().split(" ")[1].split("(")[1].split(")")[0]))
          relTarY = relTarY * (1 / parseFloat(document.querySelector("g.graph")!.getAttribute("transform")!.toString().split(" ")[1].split("(")[1].split(")")[0]))
          relSrcWidth = relSrcWidth * (1 / parseFloat(document.querySelector("g.graph")!.getAttribute("transform")!.toString().split(" ")[1].split("(")[1].split(")")[0]))
        }

        console.log(graph, source, target);
        console.log(relSrcX, relSrcY, relTarX, relTarY);

        let linkContainer = g.append('g').attr("class", "link-container")
        let link = linkContainer.append("path")
          .attr("stroke", "black")
          .attr("stroke-width", "0.5px")
          .attr("fill", "none")
          .attr("d", () => {
            console.log(relSrcX, relTarX);
            let path = ``;
            if (relSrcX == relTarX) {
              relTarX = relSrcX + relSrcWidth;
              path = `M ${relSrcX + relSrcWidth + 20} ${relSrcY + 40} L${((relTarX + (relSrcX + relSrcWidth)) / 2) + 90} ${relSrcY + 40} V${relSrcY + 40} ${relTarY + 40} L${relTarX + 20} ${relTarY + 40}`;
            } else {
              // path = `M ${paths.sources[i].x + paths.sources[i].width} ${paths.sources[i].y + (paths.sources[i].height / 2)} L${paths.sources[i].x + paths.sources[i].width + 50 - (paths.sources[i].index * 10)} ${paths.sources[i].y + (paths.sources[i].height / 2)} V${paths.sources[i].y + (paths.sources[i].height / 2)} ${paths.targets[i].y + (paths.targets[i].height / 2)} L${paths.targets[i].x - 300} ${paths.targets[i].y + (paths.targets[i].height / 2)}`;
              path = `M ${relSrcX + relSrcWidth + 20} ${relSrcY + 40} L${((relTarX + (relSrcX + relSrcWidth)) / 2) - 90} ${relSrcY + 40} V${relSrcY + 40} ${relTarY + 40} L${relTarX + 20} ${relTarY + 40}`;
            }
            console.log(path);
            return path;
          })
        svg.append("svg:defs").append("svg:marker")
          .attr("id", "arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr('refX', 10)
          .attr("markerWidth", 15)
          .attr("markerHeight", 15)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("fill", "black");

        link.attr("marker-end", "url(#arrow)")
        if (showLinkText) {
          let linkText = linkContainer.append("text")
            .attr("filter", () => {
              return `url(#background)`
            })
            .attr("fill", "black")
            .attr("x", () => {
              let textX = 0;
              if (relTarX == (relSrcX + relSrcWidth)) {
                textX = ((relTarX + (relSrcX + relSrcWidth)) / 2) + 55;
              } else {
                textX = ((relTarX + (relSrcX + relSrcWidth)) / 2) + 5;
              }
              return textX;
            })
            .style("clip-path", 'url(#rect)')
            .style("stroke", "none")
            .attr("y", () => {
              let textY = 0;
              if (relTarX == (relSrcX + relSrcWidth)) {
                textY = relTarY + 25;
              } else {
                textY = relTarY + 45;
              }
              return textY;
            })
            .text(() => {
              return "Hello World";
            })

          let linkTextOverlay = linkContainer.append("text")
            // .attr("filter", ()=>{
            //   return `url(#background)`
            // })
            .attr("fill", "black")
            .attr("x", () => {
              let textX = 0;
              if (relTarX == (relSrcX + relSrcWidth)) {
                textX = ((relTarX + (relSrcX + relSrcWidth)) / 2) + 55;
              } else {
                textX = ((relTarX + (relSrcX + relSrcWidth)) / 2) + 5;
              }
              return textX;
            })
            .style("clip-path", 'url(#rect)')
            .style("stroke", "none")
            .attr("y", () => {
              let textY = 0;
              if (relTarX == (relSrcX + relSrcWidth)) {
                textY = relTarY + 25;
              } else {
                textY = relTarY + 45;
              }
              return textY;
            })
            .text(() => {
              return "Hello World";
            })
        }
        // break;
      }
    }

    function updateWindow() {
      wx = w.innerWidth || e.clientWidth || wg.clientWidth;
      wy = w.innerHeight || e.clientHeight || wg.clientHeight;

      svg.attr("width", wx).attr("height", wy);
    }
    d3.select(window).on('resize.updatesvg', updateWindow);

  }
}
