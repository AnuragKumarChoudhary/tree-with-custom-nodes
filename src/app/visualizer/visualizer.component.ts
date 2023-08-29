import { Component, OnInit } from '@angular/core';
import { VisualisationService } from 'src/services/visualisation.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {

  constructor(private visualisation: VisualisationService) { }

  ngOnInit(): void {
    this.visualisation.generateExpandableTree(".graph-container");
  }

}
