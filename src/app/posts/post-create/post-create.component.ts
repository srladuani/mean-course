import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  templateUrl: './post-create.component.html',
  selector: 'app-post-create',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  post:           Post;
  private mode    = 'create';
  private postId: string;
  isLoading       = false;
  form:           FormGroup;
  imagePreview:   string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null,
                              {validators: [Validators.required, Validators.minLength(3)]
                            }),
      'content': new FormControl(null,
                                {validators: [Validators.required]
                              }),
      'image': new FormControl(null, {
            validators: [Validators.required],
            asyncValidators: [mimeType]
          })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode   = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((post) => {
          this.isLoading = false;
          this.post = {
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        imagePath: post.imagePath
                      };
          this.form.setValue({
            'title':   this.post.title,
            'content': this.post.content,
            'image':   this.post.imagePath
          });
        });
      } else {
        this.mode   = 'create';
        this.postId = null;
        this.post   = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return ;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(this.post.id,
                                  this.form.value.title,
                                  this.form.value.content,
                                  this.form.value.image
                                );
    }
    this.form.reset();
  }

  onImagePicket(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview  = <string> reader.result;
    };
    reader.readAsDataURL(file);
  }
}
