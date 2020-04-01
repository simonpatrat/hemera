import Dropdown from "../components/dropdown";

function userMenu(element) {
  const menuDropdown = new Dropdown(element);
  menuDropdown.init();
}

export default userMenu;
