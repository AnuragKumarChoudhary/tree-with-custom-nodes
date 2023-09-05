import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {

  constructor() { }

  generateExpandableTree(selector: string, showLinkText: boolean = true) {
    const nodedata = [
      {
        "id": "pds-cbs",
        "icon": "menu",
        "title": "PHYSICAL DATA STORAGE",
        "name": "Cloud Blob Storage",
        "level": [0, 0],
        "sub-node": [
          {
            "id": "pds-cbs-ad",
            "name": "Account Documents",
            "Description": "Lorem Ipsum I'm trying to pass a value to a d3 click event bind to a group composed of a circle and a letter. However this value remains 'undefined' in the callback function. On the other hand if I pass the same value to another function of the same group, such as .text(d => d.value) that works fine. The issue is only with the click event. Please find my piece of code:"
          },
          {
            "id": "pds-cbs-ar",
            "name": "Account Reports",
            "Description": "Lorem Ipsum"
          },
          {
            "id": "pds-cbs-r",
            "name": "Roles",
            "Description": "Lorem Ipsum"
          }
        ]
      },
      {
        "id": "pds-opd",
        "icon": "menu",
        "title": "PHYSICAL DATA STORAGE",
        "name": "On Prem Database",
        "level": [0, 1],
        "sub-node": [
          {
            "id": "pds-opd-r",
            "name": "Revenue",
            "Description": "Lorem Ipsum"
          },
          {
            "id": "pds-opd-ti",
            "name": "Transaction ID",
            "Description": "Lorem Ipsum"
          },
          {
            "id": "pds-opd-da",
            "name": "Dollar Amount",
            "Description": "Lorem Ipsum"
          }
        ]
      },
      {
        "id": "ldm-a",
        "icon": "lan",
        "title": "LOGICAL DATA MAPPING",
        "name": "Account",
        "level": [1, 0],
        "sub-node": [
          {
            "id": "ldm-a-ai",
            "name": "Account ID",
            "Description": "Lorem Ipsum"
          },
          {
            "id": "ldm-a-co",
            "name": "Created On",
            "Description": "Lorem Ipsum"
          },
          {
            "id": "ldm-a-r",
            "name": "Revenue",
            "Description": "Lorem Ipsum"
          },
          {
            "id": "ldm-a-a",
            "name": "Address",
            "Description": "Lorem Ipsum"
          }
        ]
      },
      {
        "id": "du-if",
        "icon": "data_usage",
        "title": "DATA USAGE",
        "name": "Intelligent Forecasting",
        "level": [2, 0],
        "sub-node": [
          {
            "id": "du-if-d",
            "name": "Description",
            "Description": "Lorem Ipsum"
          }
        ]
      },
      {
        "id": "du-if",
        "icon": "data_usage",
        "title": "DATA USAGE",
        "name": "Intelligent Forecasting",
        "level": [3, 1],
        "sub-node": [
          {
            "id": "du-if-d2",
            "name": "Description",
            "Description": "Lorem Ipsum"
          }
        ]
      }
    ]

    const linkData = [
      {
        "source": "pds-cbs-ad",
        "target": "ldm-a-ai"
      },
      {
        "source": "pds-cbs-ad",
        "target": "ldm-a-co"
      },
      {
        "source": "pds-opd-da",
        "target": "ldm-a-r"
      },
      {
        "source": "ldm-a-co",
        "target": "du-if-d"
      },
      {
        "source": "ldm-a-r",
        "target": "du-if-d"
      },
      {
        "source": "ldm-a-a",
        "target": "du-if-d2"
      },
      {
        "source": "pds-cbs-ar",
        "target": "ldm-a-a"
      }
    ]

    document.querySelectorAll("svg").forEach((e: any) => {
      e.parentElement.removeChild(e);
    })



    let conatinerWidth: number = document.querySelector(selector)!.getBoundingClientRect().width,
      containerHeight: number = document.querySelector(selector)!.getBoundingClientRect().height;

    let svg: any = d3.select(selector).append("svg")
      .attr("height", containerHeight)
      .attr("width", conatinerWidth);

    let g = svg.append("g").attr("class", "graph");

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
        .attr("x", (nodedata[i]["level"][0] * 600))
        .attr("y", () => {
          let yPosition;
          if (i == 0) {
            yPosition = 0;
          } else {
            let n = document.querySelector(`#${nodedata[i - 1]["id"]}`)?.getBoundingClientRect()
            yPosition = ((n!.y + n!.height + 100) * nodedata[i]["level"][1]);
          }

          return yPosition;
        })
        .style("overflow", "visible")
        .html(() => {
          let nodeHTML = `
          <div class="node-container" id="${nodedata[i]["id"]}">
          <div class="node-title"><i class="material-icons">${nodedata[i]["icon"]}</i><span>${nodedata[i]["title"]}</span></div>
          <div class="node-body">
              <div class="node-name"><span class="node-icon">000</span><span class="name">${nodedata[i]["name"]}</span><i class="material-icons">remove</i></div>
              <div class="sub-node-container">`

          for (let j = 0; j < nodedata[i]["sub-node"].length; j++) {
            nodeHTML += `<div class="sub-node">
              <div class="sub-node-name" id="${nodedata[i]["sub-node"][j]["id"]}"><span>${nodedata[i]["sub-node"][j]["name"]}</span><span><i class="material-icons" id="${nodedata[i]["sub-node"][j]["id"]}">add</i></span></div>
              <div class="sub-node-desc sub-node-desc-hidden" id="${nodedata[i]["sub-node"][j]["id"]}-desc">${nodedata[i]["sub-node"][j]["Description"]}</div>
            </div>`
          }
          nodeHTML += `</div></div></div>`
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
        console.log(`${linkData[i]["source"].split("-")[0]}-${linkData[i]["source"].split("-")[1]}`)
        console.log(nodedata.filter(item => item.id.toLowerCase().includes(`${linkData[i]["source"].split("-")[0]}-${linkData[i]["source"].split("-")[1]}`))[0].level[1]);
        let linkOffset = (nodedata.filter(item => item.id.toLowerCase().includes(`${linkData[i]["source"].split("-")[0]}-${linkData[i]["source"].split("-")[1]}`))[0].level[1]) * 10;
        console.log(linkData[i]);
        let source = document.querySelector(`#${linkData[i]["source"]}`)?.parentElement!.getBoundingClientRect();
        let target = document.querySelector(`#${linkData[i]["target"]}`)?.parentElement!.getBoundingClientRect();
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
            // let path = `M ${paths.sources[i].x + paths.sources[i].width} ${paths.sources[i].y + (paths.sources[i].height / 2)} L${paths.sources[i].x + paths.sources[i].width + 50 - (paths.sources[i].index * 10)} ${paths.sources[i].y + (paths.sources[i].height / 2)} V${paths.sources[i].y + (paths.sources[i].height / 2)} ${paths.targets[i].y + (paths.targets[i].height / 2)} L${paths.targets[i].x - 300} ${paths.targets[i].y + (paths.targets[i].height / 2)}`;
            let path = `M ${relSrcX + relSrcWidth + 20} ${relSrcY + 40} L${((relTarX + (relSrcX + relSrcWidth)) / 2) - 90 + linkOffset} ${relSrcY + 40} V${relSrcY + 40} ${relTarY + 40} L${relTarX + 20} ${relTarY + 40}`;
            console.log(path);
            return path;
          })
        svg.append("svg:defs").append("svg:marker")
          .attr("id", "arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr('refX', 10)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("fill", "black");

        link.attr("marker-end", "url(#arrow)")
        if (showLinkText) {
          let linkText = linkContainer.append("text")
            .attr("fill", "white")
            .attr("x", () => {
              return ((relTarX + (relSrcX + relSrcWidth)) / 2) + 5;
            })
            .style("clip-path", 'url(#rect)')
            .style("stroke", "none")
            .attr("y", () => {
              return relTarY + 30;
            })
            .text(() => {
              return "Hello World";
            })
        }
        // break;
      }
    }


    setTimeout(() => {
      console.log(document.querySelector("#du-if-d2")?.getBoundingClientRect().x)
    }, 200);

  }
}
