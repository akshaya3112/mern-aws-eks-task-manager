import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
  host: true,
  port: 4173,
  allowedHosts: [
    "aec1190575c3947b6928c9eeb431fb86-120367518.ap-south-1.elb.amazonaws.com"
  ]
}
})