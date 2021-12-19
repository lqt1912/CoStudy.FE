import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { PostDetailComponent } from "./post-detail/post-detail.component";
import { PostTimelineComponent } from "./post-timeline/post-timeline.component";

const routes: Routes = [
    {
        path: '',
        component: PostTimelineComponent,
        canActivate : [AuthGuard],
        children: [
            {
                path: ':id',
                component: PostDetailComponent,
                canActivate: [AuthGuard]
            }
        ]
    },
    
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
}) export class PostsRoutingModule { }