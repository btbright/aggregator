//http://buildnewgames.com/optimizing-websockets-bandwidth/

export const encodeUint8 = (function() {
  var arr = new Uint8Array( 1 );
  return function( number ) {
    // If we assume that the number passed in
    // valid, we can just use it directly.
    // return String.fromCharCode( number );
    arr[0] = number;
    return String.fromCharCode( arr[0] );
  };
}());

export const encodeFloat32 = (function() {
  var arr  = new Float32Array( 1 );
  var char = new Uint8Array( arr.buffer );
  return function( number ) {
    arr[0] = number;
    // In production code, please pay
    // attention to endianness here.
    return String.fromCharCode( char[0], char[1], char[2], char[3] );
  };
}());


// Decode
export const decodeUint8 = function( str, offset, obj, propName ) {
  obj[ propName ] = str.charCodeAt( offset );

  // Number of bytes (characters) read.
  return 1;
};

export const decodeFloat32 = (function() {
  var arr  = new Float32Array( 1 );
  var char = new Uint8Array( arr.buffer );
  return function( str, offset, obj, propName ) {
    // Again, pay attention to endianness
    // here in production code.
    for ( var i = 0; i < 4; ++i ) {
      char[i] = str.charCodeAt( offset + i );
    }

    obj[ propName ] = arr[0];

    // Number of bytes (characters) read.
    return 4;
  };
}());