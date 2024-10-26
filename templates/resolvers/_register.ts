import { ResolverRegister } from "../../src/class";

const regArray: Array<ResolverRegister> = [
  {
    name: "GitHub Release",
    entrance: "GitHub_Release",
    downloadLinkRegex: "https?://api.github.com/repos/[^/]+/[^/]+/releases",
    requiredKeys: [],
  },
  {
    name: "Lanzou",
    entrance: "lanzou",
    downloadLinkRegex: "lanzou\\w\\.com",
    requiredKeys: [],
  },
];

export default regArray;
