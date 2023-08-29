import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {

  constructor() { }

  generateTree(selector: string) {
    const treeData = {
      "name": "Eve",
      "value": 15,
      "type": "black",
      "level": "yellow",
      "children": [
        {
          "name": "Cain",
          "value": 10,
          "type": "grey",
          "level": "red"
        },
        {
          "name": "Seth",
          "value": 10,
          "type": "grey",
          "level": "red",
          "children": [
            {
              "name": "Enos",
              "value": 7.5,
              "type": "grey",
              "level": "purple"
            },
            {
              "name": "Noam",
              "value": 7.5,
              "type": "grey",
              "level": "purple"
            }
          ]
        },
        {
          "name": "Abel",
          "value": 10,
          "type": "grey",
          "level": "blue"
        },
        {
          "name": "Awan",
          "value": 10,
          "type": "grey",
          "level": "green",
          "children": [
            {
              "name": "Enoch",
              "value": 7.5,
              "type": "grey",
              "level": "orange"
            }
          ]
        },
        {
          "name": "Azura",
          "value": 10,
          "type": "grey",
          "level": "green"
        }
      ]
    };

    let conatinerWidth: number = document.querySelector(selector)!.getBoundingClientRect().width,
      containerHeight: number = document.querySelector(selector)!.getBoundingClientRect().height;

    let svg = d3.select(selector).append("svg")
      .attr("height", containerHeight)
      .attr("width", conatinerWidth);

    let g = svg.append("g");

    const treemap = d3.tree().size([containerHeight, conatinerWidth]);
    let nodes: d3.HierarchyNode<unknown | any> = d3.hierarchy(treeData, (d: any) => d.children);
    nodes = treemap(nodes);

    console.log(nodes);

    const node = g.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", (d: any) => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", (d: any) => "translate(" + d.y + "," + d.x + ")");

    const link = g.selectAll(".link")
      .data(nodes.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .style("stroke", d => d.data.level)
      .attr("d", (d: any) => {
        return "M" + d.y + "," + d.x
          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
          + " " + d.parent.y + "," + d.parent.x;
      });

    node.append("circle")
      .attr("r", d => d.data.value)
      .style("stroke", d => d.data.type)
      .style("fill", d => d.data.level);

    node.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? (d.data.value + 5) * -1 : d.data.value + 5)
      .attr("y", (d: any) => d.children && d.depth !== 0 ? -(d.data.value + 5) : d)
      .style("text-anchor", d => d.children ? "end" : "start")
      .style("fill", "white")
      .text(d => d.data.name);

  }

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
