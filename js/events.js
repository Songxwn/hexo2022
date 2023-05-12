/* global Fluid */

HTMLElement.prototype.wrap = function(wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  this.parentNode.removeChild(this);
  wrapper.appendChild(this);
};

Fluid.events = {

  registerNavbarEvent: function() {
    var navbar = jQuery('#navbar');
    if (navbar.length === 0) {
      return;
    }
    var submenu = jQuery('#navbar .dropdown-menu');
    if (navbar.offset().top > 0) {
      navbar.removeClass('navbar-dark');
      submenu.removeClass('navbar-dark');
    }
    Fluid.utils.listenScroll(function() {
      navbar[navbar.offset().top > 50 ? 'addClass' : 'removeClass']('top-nav-collapse');
      submenu[navbar.offset().top > 50 ? 'addClass' : 'removeClass']('dropdown-collapse');
      if (navbar.offset().top > 0) {
        navbar.removeClass('navbar-dark');
        submenu.removeClass('navbar-dark');
      } else {
        navbar.addClass('navbar-dark');
        submenu.removeClass('navbar-dark');
      }
    });
    jQuery('#navbar-toggler-btn').on('click', function() {
      jQuery('.animated-icon').toggleClass('open');
      jQuery('#navbar').toggleClass('navbar-col-show');
    });
  },

  registerParallaxEvent: function() {
    var ph = jQuery('#banner[parallax="true"]');
    if (ph.length === 0) {
      return;
    }
    var board = jQuery('#board');
    if (board.length === 0) {
      return;
    }
    var parallax = function() {
      var pxv = jQuery(window).scrollTop() / 5;
      var offset = parseInt(board.css('margin-top'), 10);
      var max = 96 + offset;
      if (pxv > max) {
        pxv = max;
      }
      ph.css({
        transform: 'translate3d(0,' + pxv + 'px,0)'
      });
      var sideCol = jQuery('.side-col');
      if (sideCol) {
        sideCol.css({
          'padding-top': pxv + 'px'
        });
      }
    };
    Fluid.utils.listenScroll(parallax);
  },

  registerScrollDownArrowEvent: function() {
    var scrollbar = jQuery('.scroll-down-bar');
    if (scrollbar.length === 0) {
      return;
    }
    scrollbar.on('click', function() {
      Fluid.utils.scrollToElement('#board', -jQuery('#navbar').height());
    });
  },

  registerScrollTopArrowEvent: function() {
    var topArrow = jQuery('#scroll-top-button');
    if (topArrow.length === 0) {
      return;
    }
    var board = jQuery('#board');
    if (board.length === 0) {
      return;
    }
    var posDisplay = false;
    var scrollDisplay = false;
    // Position
    var setTopArrowPos = function() {
      var boardRight = board[0].getClientRects()[0].right;
      var bodyWidth = document.body.offsetWidth;
      var right = bodyWidth - boardRight;
      posDisplay = right >= 50;
      topArrow.css({
        'bottom': posDisplay && scrollDisplay ? '20px' : '-60px',
        'right' : right - 64 + 'px'
      });
    };
    setTopArrowPos();
    jQuery(window).resize(setTopArrowPos);
    // Display
    var headerHeight = board.offset().top;
    Fluid.utils.listenScroll(function() {
      var scrollHeight = document.body.scrollTop + document.documentElement.scrollTop;
      scrollDisplay = scrollHeight >= headerHeight;
      topArrow.css({
        'bottom': posDisplay && scrollDisplay ? '20px' : '-60px'
      });
    });
    // Click
    topArrow.on('click', function() {
      jQuery('body,html').animate({
        scrollTop: 0,
        easing   : 'swing'
      });
    });
  },

  registerImageLoadedEvent: function() {
    if (!('NProgress' in window)) { return; }

    var bg = document.getElementById('banner');
    if (bg) {
      var src = bg.style.backgroundImage;
      var url = src.match(/\((.*?)\)/)[1].replace(/(['"])/g, '');
      var img = new Image();
      img.onload = function() {
        window.NProgress && window.NProgress.inc(0.2);
      };
      img.src = url;
      if (img.complete) { img.onload(); }
    }

    var notLazyImages = jQuery('main img:not([lazyload])');
    var total = notLazyImages.length;
    for (const img of notLazyImages) {
      const old = img.onload;
      img.onload = function() {
        old && old();
        window.NProgress && window.NProgress.inc(0.5 / total);
      };
      if (img.complete) { img.onload(); }
    }
  },

  registerRefreshCallback: function(callback) {
    if (!Array.isArray(Fluid.events._refreshCallbacks)) {
      Fluid.events._refreshCallbacks = [];
    }
    Fluid.events._refreshCallbacks.push(callback);
  },

  refresh: function() {
    if (Array.isArray(Fluid.events._refreshCallbacks)) {
      for (var callback of Fluid.events._refreshCallbacks) {
        if (callback instanceof Function) {
          callback();
        }
      }
    }
  },

  billboard: function() {
    if (!('console' in window)) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`
*hhkhkbkaaaaakk#bhhhhhkoak*oakhhkbahbdpbkdqdhpddwwppqqwmpmqZqm0ZLQ0CUJJYCJXXzzvcxccxvvvxuxjftftf\/\|)(\))){{}{}fCpa*bdkakabbkpphkdbkqakphkhbhddbddakb
hkkhaahobaohkkkhhbkhhhhaak*aaohkbaab0r]+>i>i!i!IIl;;I::;:,::,,,"""^^"^^"```''''..''............ .   ..               ..... .lYaadhbbahdbadkbdbpkkkbbadhddqphqabb
ahaooaoakhaaaah*hbbkdhkkokaaboohhho)`                    ...............''''''''''''''''''''''''''''''''`'''''''''''''''''''.lp#kbkakobbhkbhbbbhbhakdbdbwdqpkbkp
ohhohkhbhhbkakahahbhkaaoahhokkMhkh0  ....................'''''''''''''''''''''''''''''```'``````````''```````````````````''''"p*bhooh*okbkhbkdbkdaokdkbhkbqdhkaa
ohkhkbhkkhakhkokhabbbakhbka*b*#kbaU .................''''''''''''''''''''''''''''''''````''''`````````````````````````````'''^Zaokhohbhbkakkkhqkhdoohpaokbqkbkhk
ahakkbhbpkahdbahaakkhobohaoohoooboX ..............''''''''''''''''''''.. .`"^'''''''```'.";!I`.'````````'..'`````````````''''`0khkkbahkkbhabdkhphbhokkaaakphahha
hahhhahhkahakhkhkokdaohhhbkhkha#h*c ............'.'''''''''''''''''. 'l]/xvQZ;'``````'.<jrufnc/>`'```'..^_{,'````````````'''''Qadabphokbkkdabkdbbhkhbkaabqqbaod*
abdhobkakk*akkpabhkdhhkhhqbhkdhoaMu ........'''''''''''''''''''''..!|zYjj[1(bj `````'!v0f_;i>]|YO:.`^;_xOQ[^`````````````''''.Xokbbdkhkbbdpakhdbbbokbaaaakkkb*kq
ahabakhakkbkhkaoakkbhaakkkkkokah*&n .....'''''''''''''''''''''. "]X0v)_?-+[]np"'```'>qqJz\)<+_{Cp/\\jJpU-`.``````````````''''.zahbkdphakbbkkboakakhapohhddpwbdbp
kkakhhhkkkddkkoooahkhkbkkabdkkbaa&r ''..............'''''''''.!jCCj}+~+?>--_(a_ '`'."~\QqYntjjv[>~}n0qr:.``````````````'`''''.vhohbkhaadabahhahdkbphdqdkkkbhhpkh
aohhahhkhahbbkaokhabhhbkbokhhooaoMf  .^,;:;;I!<<~~<!I:^'. . ^jmJ}\\t{)\\/)1t|pJ-!^;|vv)~;l?+{(?|]xYurt0z.`````````````````'``./habpkbbhkbbabkkhkbadohpkkk#ahbkkq
oaahhaaakhkbkbookhabkabkbkbpkbohaM/[zccXccxcxuntzzYvxrujt/{1Jbznf?]I,,l__il!!<]\uYZn{[+!,:~nYvxr-+>~_~JY.`````````````````'`'.)kbokkhkaakhobkhbhdapkhkhpbkadbkbM
ababkhkbbhdbahhadhhkhakdkkkhhbokh&t<jLY?<-__<]!?_][]??f}xQrt(1{}!!`'''''.'''''..'t]{)-+]vc}\*rtv]!i!II0t.````````````````````.}dkohdkbkbbhbobhbhkkkh#kabdkbkqkkb
okbkobhbbabhhabka*ohkaakbkaaokahh#QujfQkX[1])-}]]{[||([_(-~><!l;l```````````````^>!~+__jCn)/z(jcn/t}/cx:`````````````````````._bbakbkpkakhhhkkokhdkkh#hkdkbkpbaw
aohddohhbkkakokhkooaohhhkbhkaaaoaW1`~nu/Q1><+?vtvv]i;`;_>>I,""^"^``````````````'`'`'''`'"l_|v\l`:i_}_:.`^^```````````````````.>hpoakkhbkaahdhdabhahkkahhobkhhbkh
hahpkkkahkhohaakaoaakdbkkbakaaa#k#/:>>[?In`.. l?I(>(:':"i!'^````````````````^`"!;^''```^,Ii~\CZnl ..'``^^^^^^^^^`````````````'!bkkhakbbkhkkbpbbbpwkkdbhkkkbakkkk
aoakhhbaoaa*ooobkhakhk*hkbkbhoboh*Ocx|+1]j{,:,']^(+!^```^^``^```````''^^````"?+~~~[>^'````'`Ixbqb|```````^``^^```````````````':qkdbobkpbokkbqkdkdqphbhadakbdhkpk
ho*hbabkahaa*hokhaoahkoabbbbbokko#{I1ftfqQX\}{|j_/"'````````^`````':!i+~l'^,^^:l?}+{)i````'. .0n|*\'`````````^^`^^```````````'^qkabkhhkqokbkbbddhkqkkdhkkdbkkkbo
bkhkkakkaadhkakakokhkko#ahkhhaakko{ .  fJ?f?~i;~)?''^``````^'``",Ii?)fr}:l+i:^''.+x~-|]^'`l[xYJ{ [r'````^^^^^^````````````````^Ohbbbhdkkdbbkbwhddbbkbkhkddadbbkp
kkhakoaboabbbahkbha#hkooahkkhaahhW1.'`u0}x(<:"Iiil^;+``"`"'!<^IIl::i))1f\}!~+:Ii>>[^_{??l-]}\nnxj{>^.'``^^^^^^`^^`````````````'Labadhhoabaokopkhphabkbdbakdbhkd#
hkkoab*hhkkaba*hbkhaabohoaahhakha#)..xL>)x1l?_~<>;'];;-+!l,'![!>~<:':1<1\]1?_<I:"'  I['}]^'...`,i[rct_`'^^^```````````````````.Jahobbkdabbbhkkqhkdokdddkhkdaphkk
abkoabokbaaokdodhkahhha*kkaahkbaaM).jav00\~})+~~i:')<!?/>!>l';f\~+<`'i+,t-)-,'```;_?l.`"^'``````'..,_vY+`^````````````````````.n#bkadbdaabhabkbdkbhkdhkbkoaphppm
hobkakhahaahMboobakkbbk#hbhoakkaa&).jpdJ(]?+/]~il:'?[}i|)?iii,:c}[+,``1^I)''````"Laod?'````````````'  zw"`````````````````````.jadbakbhk*kkkbkkkkhpkpkapaahkaaqb
kaabhhkhbhohokkadhdkkba*ohh*akkahM| 1m|u?1~+/~>i>l'itii-<{<_<:.|f]+,`.{!/JY-'```'roo#dl'`````````'.'<nY-'````^```````````````` taahp*bhp*hbhhkkka*kahhkkdkobhkkb
oaakahkahooooak*ohbbbkkahkkbkokko#|~w}[n{+?~t+__<!;"{iI?')+>>;^1(~llI~-ld#*o?'^``^)JUx;'````````',]nv]^'``````````````````````.[ahhpokdbkkkkkbdkhhbkbkdapkkadhbb
*hoaaaaook#a**paahahkkhhoakhkobko*Cm}>+f?}?+/[]~!;l![-`?^<-!!i_!(1-~i:''+Zaam,````.''.````````'`}Q/i'.`````''.'```````````````'+ahabkooadhhkkkpbkhhwkhpbabqahbhh
ao#ooaok#k*ahobhokdbaakoabbhkabkkaWt;!}u1}]+>/?il>iI[!<>-)(_<l^:[;^`'```'"i!I^``````````````'^<}xZ^.``````:+](<""^'''`````````'~pbhbbaphkbkhhkqkdbakkhkbkhbphdoh
**#Moohaoaaohakk#hhbhkpbabkhdhhba*d,:I]x1]?_<+?_>!!l:~:;-v~^````'```````^`'''``^``````````'`<|t>~qI'`````./dXCYjfxr(>''```````'>dakkhabkhbbbbbbdbhhobkhqhbbphkpp
####a#*ooaaoh*abaMokkapbhakbhhokkMQ?i;_Un{_~<;:!<i_~]<]_l";``^^^`^^```````^^````````````''!/n|{_iZ[.````')Zf]__l??<fYn:'``````';da#akhokkkbdkabbkkkahdadkapdhhha
oo#*aM#ak*aahaakd#ohkhkhkakkkbaab*v}cX/Q)]_!I>!;[;-l__:^:```````^^^^^^^^`^^^``^^^^^````'"{fff)__>fw;.'``,CulI_)~>!IilUv'``````':Okokoaokkkpdbkho*okakpabphkaaahk
##&#*#oak*ookakkko*hbbkbkabbobhhh*x `I]ar<l+-il;+?:]"l}_,`'```^^^^`^^^^^^^^^^^^^^^^^``^+ut?1(}[+<lrU[;'.:Or"I!}?<i+!+J/``..'``'"Oahbohoaahhbbpkhhkabbkkkddkakhhk
M#WM*#a***okahakkh*bhaohabkbbhhkhox.^'io1+++(<<l,->;?I;!~~>l:^````^^^^^^^^^^^^^^`^^`^`i[l,"```''.-f-tYj}![cr[?>_-!],fYjxrj1>`.'`Ookhkk#Mbabdbkbbhabhkab#obhhadaa
WMMM##oa#a*aahohhaoobhakhaaabokaa#n.^`!ax}}?/->l,^+[??!;li!!<_+iI"``^^^^^^^^^^^^^^^`^^`''`````'`[/[)+-1\xz[/h\\|[<l>:i!l+{tJY]`.J#bkphaokbhbaoboahbakhaaokkkobhp
MMMWM*MaooMoooaahahkahakdaahkkkkh#r.^^'UZ}[?|>!I:II+->[{?>lIll";>~+!^'^^^^^^^^^^^^^^^^^```^^`':1f{{}[[_~!~LZZi;_<l!]_Ii:>>;<xwc^nMhqbbbohd*hhkhahahbhk*bhaqkhhdb
&W8&M#M*ooooo*aahbakkhhakkookhokb#f.^^'_*t+~(l!ilI:,!?]]](}!i]|}~i>~?i^`^^^^^^^^^^^^````'''''~f[()][}]_~<;xQjX\l,>_:!>_+]ll><up|j*okkkaokaoobaob*kbpkkhkbhdpkkd*
88W&W#***h**aohakakhabhahbo#dkahb*/.^^``ZJ_>)_>il;;,i<">?+1}<?<}(?+]+-?l'`^^^^^^^^``"":l>i!I"l~?()\)+_}?i~Cn+mu^~-'`'``-/ll;<1Ou|a#hbkkkhaboakhphbdhkhkaddhpdahb
W8M8WooM#aa#hooakahkkhbahkh#bkahh#\.^^^'(h1?[{ii!;Il>_'`^I<?+^;~(j>!?]!+?"`^^^^^^`I_\j}]1Y([j> '">}(/(}(xCQcX?|1)^'``',|>;:!_uJ!?ahkhkqhkkqaabahdh*oaahakbadqoop
&W&MWMM##oa#oaokkaahhakaakkMhbkaaW(.^^^`:ZO_}f>!i!;;:]"^^``I|-'`"1J<'+{?+1,`^^^^^'}/(rJ??rU({cl'`''I1f|-]t)j?"}Uv?I^'`}-;>+uzt; _*qobbkahakbakkhdkhookbhhdoakbMo
&&&MW&&MMoooaoaaaahakkbbhhb#abkoh8)'^^^^')aY</?~lIII,i+`^^^'_n^^^']Ql`^-{I[^^^^^^'<f(ucv|(u-1{u;'``'.:?{<I{/x|u\rmzj/xvfncu},.''>kkoobhkk*bqhhd*kpqbadhhkkkkdd*b
8W&MMW#o#o*oohaaabkkabhbk*b*aMaha#).,^^^`:Okt|_i>!I;:"-I`^^`-fl`^^.)r'^`>_+>`^^^^^"f|zc/,_r?<?)rI`````',{(<::'^f\Uv[><>il,'.```'lpbd*bdbkadbbakahkkhhkapboakbkba
888#MWW*#Moa*hoa##hkhobhb*ahooaaa#)^Y;`^^')oY}\>l!I;;:I},`^^::,^^^^`c>`^'!{?`^^^^^'}rxY/!'-t---)\```'`^^`ij<.''|f)\mYcvt_^`````',phkodqbbh*apbahh#abdakkdhkhbdba
8&&&M8M##M*aooaaoodhkahkba*da*kho#{1Z^^^^^^Yk{n+>!I;;;,;?"`^^^^^`?,'}j.``'}{`^^^^^`:t\/f_'^{\}1/1,`^i><<+}xL)``|`|OUCZ0ZLn"`````"Qao*akbdk*hkhbbokkbdkkabdabbkdd
&8WW#W&*####*#oahokbadooaaokkoakh*{0z.^^^^'-o\jf<I:II;,^;-"^^^^^`_>'IY":l`l~`^^^^^^'_x[f+``,(\\{]^'-!i-(QQ/-j0\f1vp?[ZLZ0m[.```^`Uhhkkkbakhakkbkbhaaaoaakbokho#p
&8&WW#8#a#Moo*#aa#ohaaa*oo#hbhahhM|bY'^^^^^,pu]c\+l;;:;^i<_:'`````?;}cfx),``````^^^^"1++?'^`l\}"{>`]/XZwCwmc}n0j_[YQ|JwwpCi'```''Jhqaaqahkhhkhhdbhokphakkbdakahh
WW&&8MWW##M#*h#okokookoohkahhhkkhau#O"^^^^^`Lm~1jt?lI;::<\,_~<<il!~nc+_|t~I>>>il^`^``~_+?^''.<[(|xCwddw++bqQ{>iQ( ^>})|/}:'`````.uabkahabkaobdkkkahkdkakkha#dada
MW&&8#MM#*#Makooahhkakhabak*okobhopkk?.^^^^;zp?(u{{]<i!:,j),/aakhbf|/Y/I-[~_lIif-,;;Illi+]1|xc0pdO0dqpbQOJj|]i;?w~.''....'``````./#bdh*kahdokdpbkbkbkdbokabkbhhb
WWW&M*MW*#o#*o**#aaoaok#obk*okaak#oOfk<'^^^,up+_j/[-[~;!i~n+i{dWMn+tMaCcp_"...;|wLLqqqpb0Chkbbdbf<Uhq0u};~}+l<+,nz'`````````````.)#ha*ahhadhddkkbhokhbbbokbpakkh
&WM&#M#M#*M#W*o#aok*aaha*kkoohh#oaOa<xk-.'.ibU}-?x]?>+}_:"tt_>]qap0bkkLj0*wUt}(pavxaahhhpmahbkkkwQz|+:'''!-[_{<+<OI'````````````.1bkhohaok*hpokkbbkkapbdoqkakbhh
&8#88&WMW*#Mo*a*aahhohaaaakaoaaaW*jOC<jkr]\qOt_+!rC){{+li!+c?~l;>1]<<?>vj0wxfftrcXYXzcvvJJCCzf(]>,'''`^^^^!|}++?]J?.````````````.]khhh*aakkbakkdakb*kkwhokhddkhd
&8&&%&MWMMo#o##oahoaba*kkoaa*obh#M\;bY!]nUYj(-}<[koz{!<-+il]t+~!",~]!"'~/YYY/?I"'`''''''````''''`^^^^^^^^^'-}[{}<0t'`````````'`'.~opahb#akao#kkkaoa*obbbbkkkkhbb
&&WW&&MMWW#o###*ko#aok*abakakoba*&t >ZJ]?}<?+}>uhjrd[1]+~~>;1|~<~<ll_-<;\|}jvCx}i`^^^^^^^^^^^^^^^^^^^^^^^^`;?~<i:j?^```````````'.<dk*adaohhodkkkhaah*abbkob*aakb
&&WM8&W##MM*o##ao*#khkoob*kahaaah8j.':{rXnXnnYUc<'`xm{\{~iIi;{-_?>lI^^:>v/)]|ut-"^^^^^^^^^^^^^^^^^^^^^^^^^^``'''`''```````````''.ikkhhbapaahdkbhkopkhbddhobhkkhp
&&8&8&WM#MWaooMoooohhokakhokhakao#x.^`''"Ii<<!,'`^^^C0<}-+<^;+|-+-l^^^`;))[>!l:^^^^^^^^^^^^^^^^^^^^^^^^^^``````````````````''''''Ihabhbkhkohkaaoahkkhbhbdhkah#ad
&&&%W&W#MMMooo#Mhoohakhkkk*khkaa##x.^^^^```'```^^^^`ikf"~->->`i?>","^^^^``'`^^^^``^^^^^^^^``^^^^^`^^^^^^^```````````````'`''''''',pkakbk*ha#okokopakdohkddbaaako
&&&W&M8#MM*Mo###*hooookhbkabakakh#n.^^^^^^^^^^^^^^^^'(X^,'!~;"`"^^^^^^^^^^^^^^,I>!`^^^^^^`;;,^^^^^^^^^^```^``````````````''''''''"mhkkbhhkakabakoabbkhhbkbhakohb
&W8&&8&&###Woaoaohkobaoakkhhhahakau.^^^^^^^^`^^^^^^^^`"^^^^`^^^^^^^^^^^^^^^``"!>-n;`^^^^`]}+(``^^^^`^^^```^````````````''''''''''^mobkakhkaababa*hkkkpbhdhoakkaq
&MW&M&W&#o*&*oa**kaaak*hbhbaakahooc.^^^`^`^^^^`^^^^^^^^^^^^^^^^^^^^^^^^^^,;l>;]})}f`^^^^`\?+{,`^^```^``````````````````'''''''''''mdahk*k*khohhaaka*hkhbdkodahb*
BW&WWW8WM#a&*aaa*ao*khhobkkkobhob*Y.^^`^`^^^^^^^`^^^^^^^^^^^^^^^^^^^^^^^`!),[("{}l{}``^^'[}~->'````````````````````````''''''''''.Ch*oakhk*h*ko*khka*bakhkkadahh
B%8&WWM&###MM*hohob*#ha#aakohkaahaU.```^^^``^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`<>,1~\[~;)l````i{_?l````````````````````````'''''''''''.J#abaddkooaoakohpaaabhkkdkhkhw
8%%8W8#MM#*#*MoMahooWoh#ahabkkhpa*Y.`````````^^``^^^^^^^^^^^^^^^^^^^^^^^^^:+I::?{!;+_'^``_)}]{```````````````````````''''''''''''.Xhkhkbbahhohabaoaop*kbkaaohabb
888W&WMWMW##&#W**ohoa*aaodokaobkkMJ.``````````^^`^^^^^^^^^^^^^^^^^^^^^^^^^^````I!:";;`^^`:_>l_;````````````````''```''''''''''''' naokkkhbk*aMhohoadbahkkkbkhdoa
888&&&#WMMMoMoM#**hho#oaoah*hobkaoC.```````^`````^```^^^^^^^^``^^^`^^^^^^^^^^^^``````^````''`'``````````````''''''`'''''''''''''' ta*bdhbakoa*odkkdbkob*hbakhdkh
&888&W&MM###W##M###bo*hooaa#ahakkoJ.^^^````````^`````^^^^^^^^^^^^^^^^^^````^`^^`````````````````````````````'`'''`'''''''''''''''.1obaabaohkohokbadkhkabahbadhhd
&&%%WMM&#MW#MW#M#o#hhMohMahaokahbMC.``^^^^```````````````^^^`^^^^^`^````^``````````````````````````````````````''''''''''''''''''.]hahakhhaabakhkqokpaabkohhabdh
8&88MM#WMMMaMMoW*W*ohh*o*oahoahho*J.``^`^^^^``^^````^```^^^^^^^`^^^^^^^``^`^`````````````````````````````````''''''''''''''''''''.+b#ob#hbbkaaoakhpkbaaaooabbabb
&&&8&#&MWMMM#W*o#a#odak#a*ok#*ahbMJ'^^^^^^^```^^`^^```^```^^^^^^^^^^^`````^^```````````````````````````````''''''`'''''''''''''''.lhoa*oakhkk#hkadbbapbod#*ooha*
&M&&&MM&M&#M#oMa#*oMbaoo*oohokbob*C.^^^^^^^^^`^^^^^^`^^^^^^^^`^^^^^^^^^^^```````````````````````````'````''''`''''''''''''''''''''`qhbabhhkaohohkhpkkkdkah*akbh*
B&M8&WWWM*MW*o#oo##**hooa#k*okaokaw^'`^^^^^^^^^^^^^^^^^^^^^^^`^^^^^^`````````````````````````''`''''''''''''''''''''''''''''''''. [ddapbokkahhaophoqaakdhboohkka
%8W&&8&W##*Wo*#o*M#a*aaoka*k*hh*bo#C~,''..'''''''''`````````````^^^^^^^^^^^`^^^"^^^^^^"^"""""""",",,",",,^^^^^`^`^^^^`^^`^'^^`^:_vdkhdkhb*hohoak#ahdbMdkkbahob
|                                              |
|           欢迎来到我的博客！                  |
|           Email: me@songxwn.com              |
|                                              |
------------------------------------------------
    `);
  }
};
