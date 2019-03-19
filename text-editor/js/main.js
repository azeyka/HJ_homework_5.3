const throttle = ( handler, ms ) => {
  let timeout;
  return () => {
    clearTimeout( timeout );
    timeout = setTimeout( handler, ms );
  }
};
class TextEditor {
  constructor( container, storageKey = '_text-editor__content' ) {
    this.container = container;
    this.contentContainer = container.querySelector( '.text-editor__content' );
    this.hintContainer = container.querySelector( '.text-editor__hint' );
    this.filenameContainer = container.querySelector( '.text-editor__filename' );
    this.storageKey = storageKey;
    this.registerEvents();
    this.load( this.getStorageData() );
    
    document.addEventListener( 'dragover', event => {
      event.preventDefault();
      this.showHint();
    });
    
    document.addEventListener( 'drop', event => {
      event.preventDefault();
      this.hideHint()
      const file = event.dataTransfer.files[ 0 ]
      this.setFilename( file.name );
      this.readFile( file );  
    });
  }
  registerEvents() {
    const save = throttle( this.save.bind( this ), 1000 );
    this.contentContainer.addEventListener( 'input', save );
  }
  loadFile( e ) {
    this.contentContainer.value = e.target.result;
  }
  readFile( file ) {
    if ( file.type === 'text/plain' ) {
      const reader = new FileReader();
      reader.addEventListener( 'load', event => this.loadFile( event ) );
      reader.readAsText( file );
    } else {
      this.contentContainer.value = 'Недопустимый формат файла!'
    }
  }
  setFilename( filename ) {
    this.filenameContainer.textContent = filename;
  }
  showHint( e ) {
    this.hintContainer.classList.add( 'text-editor__hint_visible' );
  }
  hideHint() {
    this.hintContainer.classList.remove( 'text-editor__hint_visible' );
  }
  load( value ) {
    this.contentContainer.value = value || '';
  }
  getStorageData() {
    return localStorage[ this.storageKey ];
  }
  save() {
    localStorage[ this.storageKey ] = this.contentContainer.value;
  }
};

const editor = new TextEditor( document.getElementById( 'editor' ));



