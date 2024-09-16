import Cookies from 'js-cookie'

const useAppStore = defineStore(
  'app',
  {
    state: () => ({
      sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false,
        hide: false
      },
      device: 'desktop',
      size: Cookies.get('size') || 'default'
    }),
    actions: {

      toggleSideBar(withoutAnimation) {
        console.log("this.hide:"+this.sidebar.hide)
        console.log("this.withoutAnimation:"+this.sidebar.withoutAnimation)
        console.log("this.opened:"+this.sidebar.opened)
        if (this.sidebar.hide) {
          return false;
        }
        this.sidebar.opened = !this.sidebar.opened
        this.sidebar.withoutAnimation = withoutAnimation
        if (this.sidebar.opened) {
          Cookies.set('sidebarStatus', 1)
        } else {
          Cookies.set('sidebarStatus', 0)
        }
      },
      closeSideBar({ withoutAnimation }) {
        console.log("1111111:"+this.sidebar.hide)
        // console.log("1111111this.withoutAnimation:"+this.sidebar.withoutAnimation)
        // console.log("1111111this.opened:"+this.sidebar.opened)
        Cookies.set('sidebarStatus', 0)
        this.sidebar.opened = false
        this.sidebar.withoutAnimation = withoutAnimation
      },
      toggleDevice(device) {
        console.log("22222:"+this.sidebar.hide)
        this.device = device
      },
      setSize(size) {
        console.log("3333:"+this.sidebar.hide)
        this.size = size;
        Cookies.set('size', size)
      },
      toggleSideBarHide(status) {
        console.log("4444:"+this.sidebar.hide)
        this.sidebar.hide = status
      }
    }
  })

export default useAppStore