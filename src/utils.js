export function createPageUrl(pageName) {
  switch (pageName) {
    case "Dashboard":
      return "/";
    case "Calendario":
      return "/calendario";
    case "Solicitacoes":
      return "/solicitacoes";
    case "Concluidos":
      return "/concluidos";
    case "Demonstracoes":
      return "/demos";
    case "Custos":
      return "/custos";
    default:
      return "/";
  }
}