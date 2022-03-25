try {
    if ( global.gc ) { 
        global.gc();
    }
  } catch (e) {
    console.log( e )
    process.exit();
  }