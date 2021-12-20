import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { NgbDropdown, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MaterialModule } from "../material.module";
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostTimelineComponent } from "./post-timeline/post-timeline.component";
import { PostsRoutingModule } from "./posts.routing";
import { PostsService } from "./posts.service";
import { NewPostComponent } from './new-post/new-post.component';
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        PostDetailComponent,
        PostTimelineComponent,
        NewPostComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule, 
        MaterialModule, 
        MatIconModule,
        InfiniteScrollModule,
        NgbModule,
        FormsModule
    ],
    providers:[
        PostsService
    ]
}) export class PostsModule { }