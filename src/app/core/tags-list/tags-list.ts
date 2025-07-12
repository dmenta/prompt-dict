import { Component } from "@angular/core";
import { TagItem } from "../tag-item/tag-item";

@Component({
  selector: "pd-tags-list",
  imports: [TagItem],
  template: `<div class="space-y-4  w-full h-full">
    @for(tag of tags; track tag.id) {
    <pd-tag-item [url]="tag.url" [label]="tag.label" [cantidad]="tag.cantidad"></pd-tag-item>
    }
  </div> `,
  styles: ``,
})
export class TagsList {
  // create a list of at least 12 tags to display while developing
  tags = [
    { id: "1", title: "ilustraciones", label: "Ilustraciones", url: "/imagenes/ilustracion", cantidad: 23 },
    { id: "2", title: "typescript", label: "TypeScript", url: "/lenguajes/typescript", cantidad: 15 },
    { id: "3", title: "angular", label: "Angular", url: "/frameworks/angular", cantidad: 10 },
    { id: "4", title: "react", label: "React", url: "/frameworks/react", cantidad: 8 },
    { id: "5", title: "vue", label: "Vue.js", url: "/frameworks/vue", cantidad: 5 },
    { id: "6", title: "nodejs", label: "Node.js", url: "/backend/nodejs", cantidad: 12 },
    { id: "7", title: "python", label: "Python", url: "/lenguajes/python", cantidad: 20 },
    { id: "8", title: "java", label: "Java", url: "/lenguajes/java", cantidad: 18 },
    { id: "9", title: "csharp", label: "C#", url: "/lenguajes/csharp", cantidad: 14 },
    { id: "10", title: "go", label: "Go", url: "/lenguajes/go", cantidad: 7 },
    { id: "11", title: "ruby", label: "Ruby on Rails", url: "/frameworks/ruby-on-rails", cantidad: 6 },
    { id: "12", title: "swift", label: "Swift", url: "/lenguajes/swift", cantidad: 9 },
  ];
}
