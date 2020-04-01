export default class EventBuffer
{
  constructor()
  {
    this.events = [];
  }

  emit(name, ...args)
  {
    this.events.push({name, args});
  }

  process(name, callback)
  {
    this.events.forEach(event => {
      if (event.name === name) {
        callback(...event.args);
      }
    });
  }

  clear() {
    this.events.length = 0;
  }
}
