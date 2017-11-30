'use strict'

import ServerlessComponent from 'serverless-component'
import { parseTemplate, importNodeWithData, update as updateNode } from 'griffin'

export default class UpVoteElement extends ServerlessComponent {
  constructor() {
    super({
      git: 'https://github.com/rkusa/upvote-button-fns.git',
      path: btoa(location.href),
    })
  }

  initialize() {
    this.load().catch(console.error)
  }

  async load() {
    const res = await fetch(this.url)
    this.state = await res.json()

const node = importNodeWithData(UpVoteElement.template.content, [this.state], this)
    const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(node)
  }

  async toggleVote() {
    const res = await fetch(this.url, {
      method: this.state.voted ? 'DELETE' : 'POST'
    })
    const json = await res.json()
    this.state.votes = json.votes
    this.state.voted = !this.state.voted
    this.rerender()
  }

  rerender() {
    updateNode(this.shadowRoot, this, this.state)
  }

  handleClick(e) {
    this.toggleVote().catch(console.error)
  }
}

UpVoteElement.template = ServerlessComponent.tmpl`
  <style>
    :host {
      font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 10px;
    }
    a {
      cursor: pointer;
      font-size: 1.3em;
    }
    a.voted {
      font-weight: bold;
    }
  </style>

  <a class="\${locals.votes && 'voted'}" on-click="this.handleClick.bind(this)">
    <svg width="25px" viewBox="0 0 45 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <path d="M0,41 L8,41 L8,17 L0,17 L0,41 Z M44,19 C44.5,16.3 42.7,15 40.5,15 L27.88,15 L29.78,5.36 L29.84,4.72 C29.84,3.9 29.5,3.14 28.96,2.6 L26.84,0.5 L13.68,13.68 C12.94,14.4 12,15.4 12,16.5 L12,36.5 C12,38.7 14.3,41 16.5,41 L34.5,41 C36.16,41 37.58,39.5 38.18,38.06 L44.22,23.96 C44.4,23.5 44,23.02 44,22.5 L44,18.68 L44.48,18.66 L44,19 Z" fill="#abd692"></path>
        </g>
    </svg>
    &nbsp;\${locals.votes}
  </a>
`

// console.log('IMPORTED', parseTemplate)
parseTemplate(UpVoteElement.template)

customElements.define('upvote-button', UpVoteElement)