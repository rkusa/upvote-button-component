import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'upvote-button.js',
  output: {
    file: 'dist/upvote-button.js',
    format: 'iife'
  },
  name: 'UpvoteButtonComponent',
  plugins: [
    resolve()
  ]
}