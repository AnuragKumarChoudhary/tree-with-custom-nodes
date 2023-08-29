import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {

  constructor() { }

  generateExpandableTree(selector: string) {
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
            "Description": "Lorem Ipsum"
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
        .attr("y", (nodedata[i]["level"][1] * 400))
        .style("overflow", "visible")
        .html(() => {
          let nodeHTML = `
          <div class="node-container">
          <div class="node-title"><span>${nodedata[i]["title"]}</span></div>
          <div class="node-body">
              <div class="node-name"><span>${nodedata[i]["name"]}</span></div>
              <div class="sub-node-container">`

          for (let j = 0; j < nodedata[i]["sub-node"].length; j++) {
            nodeHTML += `<div class="sub-node"><div class="sub-node-name" id="${nodedata[i]["sub-node"][j]["id"]}">${nodedata[i]["sub-node"][j]["name"]}</div></div>`
          }
          nodeHTML += `</div></div></div>`
          return nodeHTML;
        })
    }

    for (let i = 0; i < linkData.length; i++) {
      console.log(linkData[i]);
      let source = document.querySelector(`#${linkData[i]["source"]}`)?.parentElement!.getBoundingClientRect();
      let target = document.querySelector(`#${linkData[i]["target"]}`)?.parentElement!.getBoundingClientRect();
      console.log(source, target);
      let link = g.append("path")
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
    }


    setTimeout(() => {
      console.log(document.querySelector("#du-if-d2")?.getBoundingClientRect().x)
    }, 200);

  }
}
