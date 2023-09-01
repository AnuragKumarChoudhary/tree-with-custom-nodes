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

    let zoom = d3.zoom().on("zoom", handleZoom)

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
          <div class="node-title"><span>${nodedata[i]["title"]}</span></div>
          <div class="node-body">
              <div class="node-name"><span>${nodedata[i]["name"]}</span></div>
              <div class="sub-node-container">`

          for (let j = 0; j < nodedata[i]["sub-node"].length; j++) {
            nodeHTML += `<div class="sub-node">
              <div class="sub-node-name" id="${nodedata[i]["sub-node"][j]["id"]}">${nodedata[i]["sub-node"][j]["name"]}</div>
              <div class="sub-node-desc sub-node-desc-hidden" id="${nodedata[i]["sub-node"][j]["id"]}-desc">${nodedata[i]["sub-node"][j]["Description"]}</div>
            </div>`
          }
          nodeHTML += `</div></div></div>`
          return nodeHTML;
        })
    }


    d3.selectAll(".sub-node").on("click", (event) => {
      console.log(event);
      document.querySelectorAll(".sub-node-desc").forEach(e=>{
        e!.classList.add("sub-node-desc-hidden");
      })
      document.querySelector(`#${event.target.id}-desc`)!.classList.remove("sub-node-desc-hidden");
    })

    for (let i = 0; i < linkData.length; i++) {
      console.log(linkData[i]);
      let source = document.querySelector(`#${linkData[i]["source"]}`)?.parentElement!.getBoundingClientRect();
      let target = document.querySelector(`#${linkData[i]["target"]}`)?.parentElement!.getBoundingClientRect();
      console.log(source, target);
      let linkContainer = g.append('g')
      let link = linkContainer.append("path")
        .attr("stroke", "white")
        .attr("stroke-width", "2px")
        .attr("fill", "none")
        .attr("d", () => {
          // let path = `M ${paths.sources[i].x + paths.sources[i].width} ${paths.sources[i].y + (paths.sources[i].height / 2)} L${paths.sources[i].x + paths.sources[i].width + 50 - (paths.sources[i].index * 10)} ${paths.sources[i].y + (paths.sources[i].height / 2)} V${paths.sources[i].y + (paths.sources[i].height / 2)} ${paths.targets[i].y + (paths.targets[i].height / 2)} L${paths.targets[i].x - 300} ${paths.targets[i].y + (paths.targets[i].height / 2)}`;
          let path = `M ${source!.x + source!.width - 30} ${source!.y - 10} L${target!.x - ((target!.x - source!.x) / 2)} ${source!.y - 10} V${source!.y - 10} ${target!.y - 10} L${target!.x - 30} ${target!.y - 10}`;
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
        .attr("fill", "white");

      link.attr("marker-end", "url(#arrow)")
      if (showLinkText) {
        let linkText = linkContainer.append("text")
          .attr("fill", "white")
          .attr("x", () => {
            return (target!.x - ((target!.x - source!.x) / 2)) + 10;
          })
          .style("clip-path", 'url(#rect)')
          .style("stroke", "none")
          .attr("y", () => {
            return target!.y - 15;
          })
          .text(() => {
            return "Hello World";
          })
      }
    }


    setTimeout(() => {
      console.log(document.querySelector("#du-if-d2")?.getBoundingClientRect().x)
    }, 200);

  }
}
