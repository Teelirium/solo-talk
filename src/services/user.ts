export function getUser() {
  return sessionStorage.getItem('user');
}

export function setUser(name: string) {
  sessionStorage.setItem('user', name);
}

export function removeUser() {
  sessionStorage.removeItem('user');
}
