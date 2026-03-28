export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      apple: {
        "primary": "#0071e3",
        "secondary": "#6e6e73",
        "accent": "#0071e3",
        "neutral": "#f5f5f7",
        "base-100": "#ffffff",
        "base-200": "#f5f5f7",
        "base-300": "#e8e8ed",
        "base-content": "#1d1d1f",
        "info": "#0071e3",
        "success": "#34c759",
        "warning": "#ff9f0a",
        "error": "#ff3b30",
      }
    }],
    darkTheme: "apple",
  }
}