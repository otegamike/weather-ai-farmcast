export const scrollIntoView = (containerId: string, tabId: string) => {
  const container = document.getElementById(containerId);
  const tab = document.getElementById(tabId);

  if (container && tab) {
    const targetScrollPos = tab.offsetLeft - container.offsetLeft;

    container.scrollTo({
      left: targetScrollPos,
      behavior: 'smooth'
    });
  }
};