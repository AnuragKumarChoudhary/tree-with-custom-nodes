import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { VisualisationService } from 'src/services/visualisation.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {

  constructor(private visualisation: VisualisationService, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get("./assets/data.json").subscribe(data => {
      console.log(data);
      this.visualisation.generateExpandableTree(".graph-container", data);

    })
  }

}
