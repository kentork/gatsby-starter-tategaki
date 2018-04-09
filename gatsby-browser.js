exports.onRouteUpdate = ({ location }) => {
  window.dispatchEvent(new Event('resize'))
}
