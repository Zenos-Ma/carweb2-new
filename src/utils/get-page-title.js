import defaultSettings from "@/settings";
import LoginHelper from "@/utils/loginHelper"
import i18n from "@/lang";
const title = LoginHelper.getTitle() || "Domilink";

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    let titleName = i18n.t(pageTitle);
    return `${titleName} - ${title}`;
  }
  return `${title}`;
}
