
   var opened = false, vkb = null, text = null, insertionS = 0, insertionE = 0;

   var userstr = navigator.userAgent.toLowerCase();
   var safari = (userstr.indexOf('applewebkit') != -1);
   var gecko  = (userstr.indexOf('gecko') != -1) && !safari;
   var standr = gecko || window.opera || safari;

   function convert_to_px(obj, value)
   {
     // Inner function - retrieves the (default) font size
     // for the given object.
     function get_font_size(obj)
     {
       // Standard way:
       if(window.getComputedStyle)
         return window.getComputedStyle(obj, "").getPropertyValue("font-size");

       // MS IE way:
       if(obj.currentStyle)
         return obj.currentStyle.fontSize;

       return "16px";
     }

     var unit, valu, last = value.length ? value.substr(value.length - 1, 1) : "";

     if(isNaN(last))
     {
       var def = get_font_size(document.body);
       unit = def.substr(def.length - 2, 2), valu = def.substr(0, def.indexOf(unit));

       switch(value)
       {
         case "xx-small": valu -= 3; break;
         case "x-small":  valu -= 2; break;
         case "small":    valu -= 1; break;
         case "medium":              break; // already set
         case "large":    valu += 1; break;
         case "x-large":  valu += 2; break;
         case "xx-large": valu += 3; break;
         default:
           if(value.length)
           {
             unit = (last == "%") ? "%" : value.substr(value.length - 2, 2);
             valu = value.substr(0, value.indexOf(unit));
           }
       }
     }
     else
       return value;

     if(unit == "px")
       return valu;

     // Below we have the main problem with the code. The problem is -
     // only MS IE has the facility ('window.screen.logicalXDPI' property)
     // to determine current screen DPI, which we need to convert values
     // from absolute length units (pt, pc, in, cm, mm) to pixels.
     //
     // Currently, no other browser has the way to retrieve the DPI,
     // so we have to use the "usual" value of 96 DPI (== 1.3333 pixels
     // per point), which is quite common for Windows machines.
     //
     // With browsers other than MS IE, only relative length units
     // (em, ex, % or px) can be used safely.

     // Pixels per point:
     var px_per_pt = window.screen.logicalXDPI ? (window.screen.logicalXDPI / 72.0) : 1.3333;

     // 'base_u' - base unit for current hierarchy level;
     // 'base_v' - base value for current hierarchy level;
     //
     var base_u, base_v = 1, obj_ = obj;

     do
     {
       var base = get_font_size(obj_);
       if(String(base).length)
       {
         var tmp = base.substr(base.length - 1, 1);

         if(isNaN(tmp))
         {
           base_u  = (tmp == "%") ? "%" : base.substr(base.length - 2, 2);
           base_v *= base.substr(0, base.indexOf(base_u));

                if(base_u == "%")  { base_v /= 100.0; }
           else if(base_u == "ex") { base_v /= 2.0; }
           else if(base_u == "em") { }
           else break;
         }
         else  
         {
           base_u  = "px";
           base_v *= base;
           break;
         }
       }

       obj_ = obj_.parentNode;
     }
     while(obj_ != document.documentElement);

     if(!base_v) { base_v = 16; base_u = "px"; }

     switch(unit)
     {
       case "%":  valu /= 50.0;
       case "ex": valu /= 2.0;
       case "em": valu *= base_v, unit = base_u;
     }

     switch(unit)
     {
       case "mm": valu *= 0.1;
       case "cm": valu *= 0.3937007874015748031496062992126;
       case "in": valu *= 6
       case "pc": valu *= 12;
       case "pt": valu *= px_per_pt;
     }

     return valu;
   }

   function keyb_change(size)
   {
     document.getElementById("switch").innerHTML = (opened ? "<img class='on'/>" : "<img class='off'/>");
     opened = !opened;

     if(opened && !vkb)
     {
       var obj = document.getElementById("keyboard");

       vkb = new VKeyboard("keyboard",    // container's id
                           keyb_callback, // reference to the callback function
                           false,          // create the arrow keys or not? (this and the following params are optional)
                           false,          // create up and down arrow keys? 
                           false,         // reserved
                           false,          // create the numpad or not?
                           "tahoma",            // font name ("" == system default)
   convert_to_px(obj,size) + "px",        // font size in px
                           "#000",        // font color
                           "#F00",        // font color for the dead keys
                           "#FFF",        // keyboard base background color
                           "#FFF",        // keys' background color
                           "#DDD",        // background color of switched/selected item
                           "#777",        // border color
                           "#CCC",        // border/font color of "inactive" key (key with no value/disabled)
                           "#FFF",        // background color of "inactive" key (key with no value/disabled)
                           "#F77",        // border color of the language selector's cell
                           true,          // show key flash on click? (false by default)
                           "#CC3300",     // font color during flash
                           "#FF9966",     // key background color during flash
                           "#CC3300",     // key border color during flash
                           false,         // embed VKeyboard into the page?
                           true,          // use 1-pixel gap between the keys?
                           0);            // index(0-based) of the initial layout
     }
     else
       vkb.Show(opened);

     text = document.getElementById("textfield");
     text.focus();

     if(document.attachEvent)
       text.attachEvent("onblur", backFocus);
   }

   function backFocus()
   {
     if(opened)
     {
       var l = text.value.length;

       setRange(text, insertionS, insertionE);

       text.focus();
     }
   }

   // Advanced callback function:
   //
   function keyb_callback(ch)
   {
     var val = text.value;

     switch(ch)
     {
       case "BackSpace":
         if(val.length)
         {
           var span = null;

           if(document.selection)
             span = document.selection.createRange().duplicate();

           if(span && span.text.length > 0)
           {
             span.text = "";
             getCaretPositions(text);
           }
           else
             deleteAtCaret(text);
         }

         break;

       case "<":
         if(insertionS > 0)
           setRange(text, insertionS - 1, insertionE - 1);

         break;

       case ">":
         if(insertionE < val.length)
           setRange(text, insertionS + 1, insertionE + 1);

         break;

       case "/\\":
         if(!standr) break;

         var prev  = val.lastIndexOf("\n", insertionS) + 1;
         var pprev = val.lastIndexOf("\n", prev - 2);
         var next  = val.indexOf("\n", insertionS);

         if(next == -1) next = val.length;
         var nnext = next - insertionS;

         if(prev > next)
         {
           prev  = val.lastIndexOf("\n", insertionS - 1) + 1;
           pprev = val.lastIndexOf("\n", prev - 2);
         }

         // number of chars in current line to the left of the caret:
         var left = insertionS - prev;

         // length of the prev. line:
         var plen = prev - pprev - 1;

         // number of chars in the prev. line to the right of the caret:
         var right = (plen <= left) ? 1 : (plen - left);

         var change = left + right;
         setRange(text, insertionS - change, insertionE - change);

         break;

       case "\\/":
         if(!standr) break;

         var prev  = val.lastIndexOf("\n", insertionS) + 1;
         var next  = val.indexOf("\n", insertionS);
         var pnext = val.indexOf("\n", next + 1);

         if( next == -1)  next = val.length;
         if(pnext == -1) pnext = val.length;

         if(pnext < next) pnext = next;

         if(prev > next)
            prev  = val.lastIndexOf("\n", insertionS - 1) + 1;

         // number of chars in current line to the left of the caret:
         var left = insertionS - prev;

         // length of the next line:
         var nlen = pnext - next;

         // number of chars in the next line to the left of the caret:
         var right = (nlen <= left) ? 0 : (nlen - left - 1);

         var change = (next - insertionS) + nlen - right;
         setRange(text, insertionS + change, insertionE + change);

         break;

       default:
         insertAtCaret(text, (ch == "Enter" ? (window.opera ? '\r\n' : '\n') : ch));
     }
   }

   // This function retrieves the position (in chars, relative to
   // the start of the text) of the edit cursor (caret), or, if
   // text is selected in the TEXTAREA, the start and end positions
   // of the selection.
   //
   function getCaretPositions(ctrl)
   {
     var CaretPosS = -1, CaretPosE = 0;

     // Mozilla way:
     if(ctrl.selectionStart || (ctrl.selectionStart == '0'))
     {
       CaretPosS = ctrl.selectionStart;
       CaretPosE = ctrl.selectionEnd;

       insertionS = CaretPosS == -1 ? CaretPosE : CaretPosS;
       insertionE = CaretPosE;
     }
     // IE way:
     else if(document.selection && ctrl.createTextRange)
     {
       var start = end = 0;
       try
       {
         start = Math.abs(document.selection.createRange().moveStart("character", -10000000)); // start

         if (start > 0)
         {
           try
           {
             var endReal = Math.abs(ctrl.createTextRange().moveEnd("character", -10000000));

             var r = document.body.createTextRange();
             r.moveToElementText(ctrl);
             var sTest = Math.abs(r.moveStart("character", -10000000));
             var eTest = Math.abs(r.moveEnd("character", -10000000));

             if ((ctrl.tagName.toLowerCase() != 'input') && (eTest - endReal == sTest))
               start -= sTest;
           }
           catch(err) {}
         }
       }
       catch (e) {}

       try
       {
         end = Math.abs(document.selection.createRange().moveEnd("character", -10000000)); // end
         if(end > 0)
         {
           try
           {
             var endReal = Math.abs(ctrl.createTextRange().moveEnd("character", -10000000));

             var r = document.body.createTextRange();
             r.moveToElementText(ctrl);
             var sTest = Math.abs(r.moveStart("character", -10000000));
             var eTest = Math.abs(r.moveEnd("character", -10000000));

             if ((ctrl.tagName.toLowerCase() != 'input') && (eTest - endReal == sTest))
              end -= sTest;
           }
           catch(err) {}
         }
       }
       catch (e) {}

       insertionS = start;
       insertionE = end
     }
   }

   function setRange(ctrl, start, end)
   {
     if(ctrl.setSelectionRange) // Standard way (Mozilla, Opera, Safari ...)
     {
       ctrl.setSelectionRange(start, end);
     }
     else // MS IE
     {
       var range;

       try
       {
         range = ctrl.createTextRange();
       }
       catch(e)
       {
         try
         {
           range = document.body.createTextRange();
           range.moveToElementText(ctrl);
         }
         catch(e)
         {
           range = null;
         }
       }

       if(!range) return;

       range.collapse(true);
       range.moveStart("character", start);
       range.moveEnd("character", end - start);
       range.select();
     }

     insertionS = start;
     insertionE = end;
   }

   function deleteSelection(ctrl)
   {
     if(insertionS == insertionE) return;

     var tmp = (document.selection && !window.opera) ? ctrl.value.replace(/\r/g,"") : ctrl.value;
     ctrl.value = tmp.substring(0, insertionS) + tmp.substring(insertionE, tmp.length);

     setRange(ctrl, insertionS, insertionS);
   }

   function deleteAtCaret(ctrl)
   {
     // if(insertionE < insertionS) insertionE = insertionS;
     if(insertionS != insertionE)
     {
       deleteSelection(ctrl);
       return;
     }

     if(insertionS == insertionE)
       insertionS = insertionS - 1;

     var tmp = (document.selection && !window.opera) ? ctrl.value.replace(/\r/g,"") : ctrl.value;
     ctrl.value = tmp.substring(0, insertionS) + tmp.substring(insertionE, tmp.length);

     setRange(ctrl, insertionS, insertionS);
   }

   // This function inserts text at the caret position:
   //
   function insertAtCaret(ctrl, val)
   {
     if(insertionS != insertionE) deleteSelection(ctrl);

     if(gecko && document.createEvent && !window.opera)
     {
       var e = document.createEvent("KeyboardEvent");

       if(e.initKeyEvent && ctrl.dispatchEvent)
       {
         e.initKeyEvent("keypress",        // in DOMString typeArg,
                        false,             // in boolean canBubbleArg,
                        true,              // in boolean cancelableArg,
                        null,              // in nsIDOMAbstractView viewArg, specifies UIEvent.view. This value may be null;
                        false,             // in boolean ctrlKeyArg,
                        false,             // in boolean altKeyArg,
                        false,             // in boolean shiftKeyArg,
                        false,             // in boolean metaKeyArg,
                        null,              // key code;
                        val.charCodeAt(0));// char code.

         ctrl.dispatchEvent(e);
       }
     }
     else
     {
       var tmp = (document.selection && !window.opera) ? ctrl.value.replace(/\r/g,"") : ctrl.value;
       ctrl.value = tmp.substring(0, insertionS) + val + tmp.substring(insertionS, tmp.length);
     }

     setRange(ctrl, insertionS + val.length, insertionS + val.length);
   }