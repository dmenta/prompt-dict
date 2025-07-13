import { Component } from "@angular/core";
import { ActionButton } from "../action-button";

@Component({
  selector: "pd-copy-actions",
  imports: [ActionButton],
  template: `<div class="space-x-2">
    <pd-action-button
      ><svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
      </svg>
    </pd-action-button>
    <pd-action-button
      ><svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
      </svg>
    </pd-action-button>
  </div>`,
})
export class CopyActions {}
