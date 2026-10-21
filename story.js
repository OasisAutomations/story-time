// Story Time engine: original characters, offline template grammar, seeded and reproducible.
// Works in the browser (window.StoryEngine) and in Node (module.exports) for testing.
(function (root) {
'use strict';
const VERSION = 1;

// ---------- seeded random ----------
function mulberry32(a) {
  return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const newSeed = () => (Math.floor(Math.random() * 899999) + 100000);

// ---------- heroes (all original) ----------
const HEROES = [
  { id: 'fox', name: 'Pip', label: 'Sleepy Fox', desc: 'a sleepy little fox', p: 'she', step: 'pat', move: ['trotted', 'tiptoed', 'padded'], feature: 'a fluffy orange tail',
    trait: ['Pip loved long, lazy naps in the sun.', 'Pip always had a sleepy, happy smile.', 'Pip had a fluffy tail, just right for cuddles.'], bed: ['curled up in a soft, round ball', 'tucked {his} fluffy tail around {his} nose'] },
  { id: 'cloud', name: 'Wisp', label: 'Little Cloud', desc: 'a little white cloud', p: 'he', step: 'whoosh', move: ['floated', 'drifted', 'bobbed'], feature: 'soft, puffy edges',
    trait: ['Wisp was as soft as a pillow.', 'Wisp liked to make tiny, tiny raindrops.', 'Wisp loved to float and dream.'], bed: ['snuggled into a soft, puffy pile', 'floated down low and got very still'] },
  { id: 'turtle', name: 'Tilly', label: 'Brave Turtle', desc: 'a brave little turtle', p: 'she', step: 'plod', move: ['crawled', 'stepped', 'plodded'], feature: 'a shiny green shell',
    trait: ['Tilly went slow and steady, every single day.', 'Tilly had a shiny green shell, round like a hill.', 'Tilly was little, but Tilly was brave.'], bed: ['tucked into {his} cozy shell', 'pulled in {his} head and toes, all snug'] },
  { id: 'bunny', name: 'Mimi', label: 'Moon Bunny', desc: 'a moon bunny', p: 'she', step: 'hop', move: ['hopped', 'bounced', 'bopped'], feature: 'long, silver ears',
    trait: ['Mimi had long, silver ears that wiggled when she giggled.', 'Mimi loved to hop by the light of the moon.', 'Mimi had a soft, fluffy tail like a cotton ball.'], bed: ['snuggled into a nest of soft blankets', 'folded down {his} long ears'] },
  { id: 'dragon', name: 'Ziggy', label: 'Tiny Dragon', desc: 'a tiny dragon', p: 'he', step: 'flap', move: ['flapped', 'fluttered', 'zoomed'], feature: 'little purple wings', fearsDark: true,
    trait: ['Ziggy was a little bit afraid of the dark.', 'Ziggy had tiny wings and a tiny tail, and a big, kind heart.', 'Ziggy could puff little warm clouds, puff, puff.'], bed: ['curled up with {his} tail around {his} toes', 'folded {his} little wings and snuggled down'] },
  { id: 'ladybug', name: 'Dot', label: 'Little Ladybug', desc: 'a little ladybug', p: 'she', step: 'buzz', move: ['flew', 'buzzed', 'zipped'], feature: 'seven tiny spots',
    trait: ['Dot had seven tiny spots, and she loved every one.', 'Dot was small, small, small, and very happy.', 'Dot liked to ride on the breeze.'], bed: ['snuggled under a soft leaf blanket', 'tucked in on a cozy flower bed'] },
  { id: 'owl', name: 'Olive', label: 'Baby Owl', desc: 'a baby owl', p: 'she', step: 'swoop', move: ['flew', 'swooped', 'fluttered'], feature: 'big, round eyes',
    trait: ['Olive had big, round eyes that saw everything.', 'Olive liked to say hoo, hoo, very softly.', 'Olive had the softest, fluffiest feathers.'], bed: ['tucked into a cozy tree nest', 'fluffed up {his} feathers and settled in'] },
  { id: 'bear', name: 'Maple', label: 'Bear Cub', desc: 'a fuzzy bear cub', p: 'he', step: 'thump', move: ['toddled', 'waddled', 'tromped'], feature: 'round, fuzzy ears',
    trait: ['Maple loved big hugs and honey toast.', 'Maple was fuzzy from ears to toes.', 'Maple liked to hum a happy little hum.'], bed: ['curled up in a warm, snug den', 'hugged {his} soft blanket close'] },
  { id: 'whale', name: 'Juno', label: 'Little Whale', desc: 'a little whale', p: 'he', step: 'splash', move: ['swam', 'glided', 'splashed'], feature: 'a tiny water spout',
    trait: ['Juno could make a tiny fountain, pfff!', 'Juno loved to sing long, low songs.', 'Juno was the smallest whale, with the biggest smile.'], bed: ['floated in a calm, quiet spot', 'rocked gently, like a little boat'] },
  { id: 'penguin', name: 'Puddle', label: 'Baby Penguin', desc: 'a baby penguin', p: 'he', step: 'waddle', move: ['waddled', 'slid', 'shuffled'], feature: 'a soft, white tummy',
    trait: ['Puddle loved to slide on his soft, white tummy.', 'Puddle had happy orange feet that went flap, flap.', 'Puddle was round and little and full of giggles.'], bed: ['snuggled into a warm, cozy nest', 'tucked {his} flippers in and got all cozy'] },
];

// ---------- places ----------
const PLACES = [
  { id: 'forest', label: 'Forest', full: 'the whispering forest', short: 'forest', title: 'the Whispering Forest', sound: 'swish', src: 'the leaves',
    sights: ['tall, green trees', 'soft, green moss', 'little brown mushrooms', 'bright yellow leaves', 'a bubbly little stream'],
    friends: [['squirrel', 'Nutmeg'], ['hedgehog', 'Bramble'], ['baby deer', 'Fern']],
    night: ['The moon peeked through the trees.', 'The forest grew soft and quiet.'], count: ['star', 'stars', 'twinkling'],
    items: [['a shiny red apple', 'the shiny red apple', 'shiny red apple'], ['a basket of sweet berries', 'the basket of berries', 'basket of berries']],
    obstacles: ['a wobbly log bridge', 'a big, bumpy hill'], builds: [['a little stick house', 'the little stick house'], ['a tall pile of pinecones', 'the pile of pinecones']],
    foods: [['a sweet purple berry', 'the purple berry', 'squish'], ['a crunchy little nut', 'the little nut', 'crunch']], things: 'acorns',
    wait: [['a sleepy flower open up', 'the flower opened, petal by petal']] },
  { id: 'beach', label: 'Beach', full: 'the sunny beach', short: 'beach', title: 'the Sunny Beach', sound: 'shhh', src: 'the waves',
    sights: ['warm, soft sand', 'little pink shells', 'gentle blue waves', 'a big sand castle', 'a happy red crab'],
    friends: [['crab', 'Clicky'], ['seagull', 'Breezy'], ['sandpiper', 'Kip']],
    night: ['The waves grew quiet and slow.', 'The sand felt cool and soft.'], count: ['star', 'stars', 'twinkling'],
    items: [['a bright red bucket', 'the red bucket', 'red bucket'], ['a big, bouncy beach ball', 'the beach ball', 'beach ball']],
    obstacles: ['a big, splashy wave', 'a tall, sandy hill'], builds: [['a tall sand castle', 'the sand castle'], ['a little sand turtle', 'the sand turtle']],
    foods: [['a slice of juicy watermelon', 'the watermelon', 'slurp'], ['a bite of yellow pineapple', 'the pineapple', 'chomp']], things: 'shells',
    wait: [['the waves bring a pretty shell', 'a tiny pink shell rolled right up to them']] },
  { id: 'stars', label: 'The Stars', full: 'the starry sky', short: 'sky', title: 'the Starry Sky', sound: 'twinkle', src: 'the stars',
    sights: ['twinkly little stars', 'a big, round moon', 'soft, silver clouds', 'a sparkly star path', 'a shooting star'],
    friends: [['firefly', 'Glow'], ['little star', 'Shimmer'], ['moth', 'Velvet']],
    night: ['The stars began to twinkle, one by one.', 'The moon gave a soft, silver glow.'], count: ['star', 'stars', 'twinkling'],
    items: [['a glowing star lantern', 'the star lantern', 'star lantern'], ['a soft cloud pillow', 'the cloud pillow', 'cloud pillow']],
    obstacles: ['a big, puffy cloud', 'a long, twisty moonbeam slide'], builds: [['a tower of fluffy clouds', 'the cloud tower'], ['a little star castle', 'the star castle']],
    foods: [['a bite of sparkly moon cake', 'the moon cake', 'nibble'], ['a twinkly star cookie', 'the star cookie', 'crunch']], things: 'sparkly stars',
    wait: [['a shooting star', 'a shooting star went whoosh across the sky']] },
  { id: 'farm', label: 'Farm', full: 'the big red farm', short: 'farm', title: 'the Big Red Farm', sound: 'moo', src: 'the cows',
    sights: ['a big red barn', 'fluffy white sheep', 'yellow hay bales', 'a muddy little pond', 'a tall green tractor'],
    friends: [['lamb', 'Clover'], ['duckling', 'Biscuit'], ['chick', 'Peep']],
    night: ['The cows gave one last, sleepy moo.', 'The barn lights glowed warm and yellow.'], count: ['star', 'stars', 'twinkling'],
    items: [['a big yellow wagon', 'the yellow wagon', 'yellow wagon'], ['a little toy tractor', 'the toy tractor', 'toy tractor']],
    obstacles: ['a squishy, muddy puddle', 'a tall stack of hay'], builds: [['a tall hay tower', 'the hay tower'], ['a little mud pie house', 'the mud pie house']],
    foods: [['a crunchy orange carrot', 'the carrot', 'crunch'], ['a little green pea', 'the green pea', 'pop']], things: 'apples',
    wait: [['a little egg hatch', 'crack, crack, peep, a fluffy chick popped out']] },
  { id: 'rain', label: 'Rainy Town', full: 'the rainy little town', short: 'town', title: 'the Rainy Little Town', sound: 'pitter-patter', src: 'the rain',
    sights: ['shiny, wet streets', 'bright, splashy puddles', 'colorful umbrellas', 'little houses with warm windows', 'a red bus going by'],
    friends: [['snail', 'Shelly'], ['frog', 'Lily'], ['duck', 'Splash']],
    night: ['The rain went pitter-patter, soft and slow.', 'The windows glowed, warm and bright.'], count: ['raindrop', 'raindrops', 'falling softly'],
    items: [['a big yellow umbrella', 'the yellow umbrella', 'yellow umbrella'], ['a pair of splashy boots', 'the splashy boots', 'splashy boots']],
    obstacles: ['a big, deep puddle', 'a long, slippy hill'], builds: [['a little paper boat', 'the paper boat'], ['a tall tower of blocks', 'the block tower']],
    foods: [['a warm bowl of soup', 'the soup', 'slurp'], ['a piece of green broccoli', 'the broccoli', 'munch']], things: 'little pebbles',
    wait: [['the rain stop', 'the rain stopped, and a rainbow came out']] },
  { id: 'sea', label: 'Under the Sea', full: 'the deep blue sea', short: 'sea', title: 'the Deep Blue Sea', sound: 'blub', src: 'the bubbles',
    sights: ['swaying green seaweed', 'bright orange fish', 'bumpy pink coral', 'tiny, round bubbles', 'a sleepy sea turtle'],
    friends: [['seahorse', 'Ripple'], ['octopus', 'Noodle'], ['starfish', 'Twirl']],
    night: ['The water grew calm and dark blue.', 'The fish swam slowly home.'], count: ['bubble', 'bubbles', 'floating up'],
    items: [['a pretty blue shell', 'the blue shell', 'blue shell'], ['a bouncy bubble ball', 'the bubble ball', 'bubble ball']],
    obstacles: ['a big, swirly wave', 'a tall wall of coral'], builds: [['a little sand castle', 'the sand castle'], ['a tower of pebbles', 'the pebble tower']],
    foods: [['a bite of crunchy seaweed', 'the seaweed', 'crunch'], ['a tiny sea grape', 'the sea grape', 'pop']], things: 'pearls',
    wait: [['a clam open up', 'the clam opened, and inside was a shiny pearl']] },
  { id: 'garden', label: 'Garden', full: 'the sunny garden', short: 'garden', title: 'the Sunny Garden', sound: 'buzz', src: 'the bees',
    sights: ['bright red flowers', 'tall, yellow sunflowers', 'a little wooden fence', 'busy, buzzy bees', 'a wiggly worm'],
    friends: [['bee', 'Bumble'], ['butterfly', 'Flutter'], ['worm', 'Wiggly']],
    night: ['The flowers closed up tight.', 'The bees flew home to bed.'], count: ['star', 'stars', 'twinkling'],
    items: [['a little watering can', 'the watering can', 'watering can'], ['a bright red wheelbarrow', 'the wheelbarrow', 'wheelbarrow']],
    obstacles: ['a tall, twisty vine', 'a wobbly stepping-stone path'], builds: [['a pretty flower crown', 'the flower crown'], ['a tall tower of flower pots', 'the flower pot tower']],
    foods: [['a sweet red strawberry', 'the strawberry', 'munch'], ['a cool, crunchy cucumber', 'the cucumber', 'crunch']], things: 'seeds',
    wait: [['a little seed grow', 'a tiny green sprout popped up']] },
  { id: 'snow', label: 'Snowy Hills', full: 'the snowy hills', short: 'snowy hills', title: 'the Snowy Hills', sound: 'crunch', src: 'the snow',
    sights: ['soft, white snow', 'tall pine trees', 'sparkly icicles', 'a big snowy hill', 'tiny snowflakes'],
    friends: [['snow hare', 'Flurry'], ['baby seal', 'Button'], ['little reindeer', 'Pine']],
    night: ['The snow glowed softly under the moon.', 'Everything was white and still.'], count: ['snowflake', 'snowflakes', 'falling softly'],
    items: [['a little red sled', 'the red sled', 'red sled'], ['a fuzzy, warm scarf', 'the fuzzy scarf', 'fuzzy scarf']],
    obstacles: ['a big, slippy snow hill', 'a tall pile of snow'], builds: [['a round little snowman', 'the snowman'], ['a cozy snow fort', 'the snow fort']],
    foods: [['a cup of warm cocoa', 'the warm cocoa', 'sip'], ['a warm sweet potato', 'the sweet potato', 'munch']], things: 'snowballs',
    wait: [['the snow fall', 'soft, white snowflakes came floating down']] },
];

// ---------- lessons ----------
const LESSONS = [
  { id: 'sharing', label: 'Sharing', titles: ['{hero} Learns to Share', '{hero} Shares at {placeTitle}'],
    refrain: ['Sharing is caring, a little and a lot.', 'When we share, we both get a smile.', 'Sharing makes a happy heart.'],
    variants: [
      [['{hero} had {itemA}.', '{friend} looked at it with big, wishing eyes.'],
       ['“Mine!” said {hero}, and held it tight.', 'But {friend} looked [a little sad|so sad].'],
       ['{hero} thought and thought.', '“We can share!” said {hero}.', 'One turn for you, and one turn for me.']],
      [['{hero} brought {itemA} to play with.', '{friend} wanted a turn, too.'],
       ['{hero} did not want to share at first.', 'Then {hero} [remembered|thought about] how nice it feels to share.'],
       ['“Here you go,” said {hero}.', '{friend} smiled a big, big smile.', 'And {hero} smiled too.']]],
    extra: [['{hero} and {friend} took turns with {itemThe}.', 'It was even more fun with two!'], ['Your turn, my turn, your turn, my turn.', 'Round and round they went.']] },
  { id: 'brave', label: 'Being Brave', titles: ['Brave Little {hero}', '{hero} Is Brave'],
    refrain: ['Brave means trying, even when you feel small.', 'Little steps can be brave steps.', 'Being brave can start with one little step.'],
    variants: [
      [['On the way, there was {obstacle}.', '{hero} felt a wobble in {his} tummy.'],
       ['“I can\'t,” whispered {hero}.', '“You can try,” said {friend}.', '“I will stay right here with you.”'],
       ['One little step.', 'Two little steps.', 'Three little steps, and {hero} did it!']],
      [['{friend} wanted to go past {obstacle}.', 'But {hero} felt [shy|small] and [scared|wobbly].'],
       ['{hero} took a big, deep breath.', 'In, and out.'],
       ['Slowly, slowly, {hero} went too.', '{hero} was brave, and it was fun!']]],
    extra: [['{hero} felt tall and brave and proud.', '“I did it!” said {hero}.'], ['“You were so brave!” said {friend}.', '{hero} did a happy wiggle.']] },
  { id: 'sorry', label: 'Saying Sorry', titles: ['{hero} Says Sorry', 'I\'m Sorry, {friend}'],
    refrain: ['Saying sorry helps make things better.', 'A sorry and a hug can fix a lot.', 'Sorry is a small word with a big hug inside.'],
    variants: [
      [['{friend} made {buildA}.', 'It was [so|very] [pretty|special].'],
       ['But {hero} was going fast, fast, fast.', 'Bump!', 'Down fell {buildThe}.'],
       ['{friend} looked sad.', '“I\'m sorry,” said {hero}.', '“Let\'s make it again, together.”']],
      [['{hero} wanted {friend}\'s {itemBare}.', 'So {hero} grabbed it, without asking.'],
       ['{friend} said, “Hey, that\'s mine!”', '{hero} felt a [funny|heavy] feeling inside.'],
       ['{hero} gave it back.', '“I\'m sorry,” said {hero}.', '“Can I please have a turn?”']]],
    extra: [['“That\'s okay,” said {friend}.', 'Saying sorry made them both feel better.'], ['{friend} gave {hero} a hug.', 'Now they were happy again.']] },
  { id: 'food', label: 'Trying New Food', titles: ['{hero} Tries Something New', 'One Little Bite, {hero}'],
    refrain: ['New foods can be yummy foods.', 'One little bite can be a big surprise.', 'Trying new things is brave and tasty.'],
    variants: [
      [['{friend} had a snack, {foodA}.', '“Want some?” asked {friend}.'],
       ['{hero} had never tried {foodThe} before.', 'It looked new.', 'It looked [funny|different].'],
       ['{hero} took a teeny, tiny bite.', '{bite}, {bite}!', '“Yum!” said {hero}.']],
      [['It was snack time!', 'There was {foodA} to try.'],
       ['“No, thank you,” said {hero}.', '“Just one little taste?” asked {friend}.'],
       ['{hero} took a tiny taste.', '{bite}, {bite}.', '“Hey, I like it!”']]],
    extra: [['{hero} tried one more bite.', 'New food can be yummy food!'], ['{hero} and {friend} ate the snack together.', '{bite}, {bite}, {bite}.']] },
  { id: 'calm', label: 'Bedtime Calm', titles: ['Slow and Soft, {hero}', '{hero}\'s Calm Breaths'],
    refrain: ['Slow breaths help our bodies feel calm.', 'Slow and soft, slow and soft, that is how we rest.', 'In and out, nice and slow.'],
    variants: [
      [['{hero} and {friend} played and played.', '{hero} felt wiggly and giggly and jumpy.'],
       ['“Let\'s take slow breaths,” said {friend}.', 'Breathe in, like smelling a flower.', 'Breathe out, like blowing a bubble.'],
       ['In, and out.', 'In, and out.', '{hero}\'s wiggles grew [small and soft|slow and quiet].']],
      [['{hero} was busy, busy, busy.', '{He} zoomed here and there and everywhere.'],
       ['{friend} sang a soft, slow song.', 'La, la, lu.', 'La, la, lu.'],
       ['{hero} wiggled less and less.', '{His} body felt [soft and floppy|warm and calm].']]],
    extra: [['{hero} listened to {soundSrc}, {sound}, {sound}.', 'So calm, so cozy.'], ['{hero} held very still, like a little stone.', 'So quiet, so calm.']] },
  { id: 'kind', label: 'Being Kind', titles: ['{hero}\'s Kind Heart', '{hero} and {friend}'],
    refrain: ['A kind heart is a happy heart.', 'Being kind makes everyone glow.', 'Little kindness, big smiles.'],
    variants: [
      [['Oh no!', '{friend} dropped a whole basket of {things}.', 'They went everywhere!'],
       ['{hero} came to help.', 'Pick one up, put one in.', 'Pick one up, put one in.'],
       ['“Thank you!” said {friend}.', 'Being kind made {hero} feel [warm|glowy] inside.']],
      [['{friend} wanted to play, but did not know how.', '{friend} felt shy.'],
       ['{hero} smiled a kind smile.', '“Come on, I will show you!”'],
       ['They played together, side by side.', '“Thank you, {hero},” said {friend}.']]],
    extra: [['Helping friends are happy friends.', '{hero} and {friend} [smiled|giggled] together.'], ['{friend} gave {hero} a great big hug.', 'Kind, kind, kind.']] },
  { id: 'feelings', label: 'Big Feelings', titles: ['{hero}\'s Big Feelings', 'It\'s Okay, {hero}'],
    refrain: ['All feelings are okay, and they come and go.', 'Big feelings get smaller with a hug.', 'It is okay to feel, and it is okay to ask for a hug.'],
    variants: [
      [['{hero} made {buildA}.', 'Then, whoosh!', 'Down it fell.'],
       ['{hero} felt mad, mad, mad.', '{His} face got hot, and {he} went stomp, stomp, stomp.'],
       ['{friend} sat close by.', '“Big feelings are okay,” said {friend}.', '“Let\'s take a big breath.”']],
      [['{hero} wanted to play more.', 'But {friend} had to rest for a bit.'],
       ['{hero} felt sad.', 'A little tear rolled down {his} cheek.'],
       ['{friend} gave {hero} a big, soft hug.', '“It\'s okay to feel sad,” said {friend}.']]],
    extra: [['{hero} breathed in, and breathed out.', 'The big feeling got smaller and smaller.'], ['Soon the feeling floated away, like a little cloud.', '{hero} felt better.']] },
  { id: 'patience', label: 'Patience', titles: ['{hero} Waits and Waits', 'Wait a Little, {hero}'],
    refrain: ['Waiting is hard, but we can do it.', 'Good things can come when we wait.', 'Little by little, good things grow.'],
    variants: [
      [['{hero} wanted to see {waitSee}.', '“Now, now, now!” said {hero}.'],
       ['“We have to wait,” said {friend}.', 'So they waited, and waited, and waited.'],
       ['They counted, one, two, three, four, five.', 'And then, {waitPay}!']],
      [['{hero} and {friend} wanted to see {waitSee}.', '{hero} [hopped|wiggled] and said, “Is it time yet?”'],
       ['“Not yet,” said {friend}.', '“Let\'s sing a waiting song.”'],
       ['Wait, wait, wait, little by little.', 'And then, {waitPay}!']]],
    extra: [['“It was worth the wait!” said {hero}.', 'Waiting was hard, but {hero} did it.'], ['{hero} gave a happy little cheer.', 'Hooray, hooray!']] },
];

// ---------- story skeleton ----------
// Each beat: list of alternative pages; a page is a list of sentence templates (1-3 sentences).
const BEATS = {
  intro: [['Once upon a time, there was {heroDesc} named {hero}.', '{trait}'],
          ['In a [cozy|snug|quiet] little home lived {heroDesc} named {hero}.', '{trait}'],
          ['This is a story about {heroDesc} named {hero}.', '{trait}'],
          ['Once, not long ago, there lived {heroDesc} called {hero}.', '{hero} had {feature}.']],
  go: [['One [sunny|bright|happy|lovely] [morning|day|afternoon], {hero} went to {placeFull}.', '{step}, {step}, {step}!'],
       ['{hero} {move} all the way to {placeFull}.', '{step}, {step}, {step}!', '[Here we go!|What a fun day!]'],
       ['“Let\'s go [visit|explore] {placeFull}!” said {hero}.', 'So off {he} {move}, {step}, {step}, {step}.']],
  look: [['{hero} saw {sight1}.', '{hero} saw {sight2}.', '{sound}, {sound}, went {soundSrc}.'],
         ['{hero} saw {sight1} and {sight2}.', '{sound}, {sound}, went {soundSrc}.'],
         ['{hero} looked up and down and all around.', '[Look!|Oh, look!]', '{sight1}!']],
  extraSight: [['{hero} saw {sight3}, too.', '[How pretty!|How lovely!|Wow, wow, wow!]'],
               ['{sound}, {sound}, went {soundSrc}.', '{hero} [smiled a big smile|did a happy wiggle|felt happy all over].']],
  meet: [['Then {hero} met {friendIntro}.', '“Hello!” said {hero}.', '“Hello!” said {friend}.'],
         ['Who is that?', 'It was {friendIntro}!', '“Let\'s play!” said {friend}.'],
         ['Along the way, {hero} found a new friend.', 'It was {friendIntro}!', '“Hi, {hero}!” said {friend}.']],
  refrain: [['{refrain}', '{hero} and {friend} [played and played|giggled and giggled|played all afternoon].'],
            ['{hero} [smiled a big smile|felt happy inside].', '{refrain}']],
  dusk: [['The sun went down, down, down.', 'The sky turned [pink and gold|soft and purple|orange and pink].'],
         ['Soon the sky grew [soft and dim|pink and sleepy].', '{nightLine}']],
  count: [['One little {count1}.', 'Two little {countN}.', 'Three little {countN}, {countVerb} just for {hero}.'],
          ['{nightLine}', 'One, two, three little {countN}.', '[So soft.|So sleepy.|So still.]']],
  countDark: [['The stars came out, like tiny night-lights.', 'One, two, three, twinkle!', 'Now {hero} was not scared of the dark at all.'],
              ['Then {friend} said, “Look up!”', 'The stars glowed like little night-lights.', '{hero} smiled, and the dark felt cozy.']],
  home: [['“Goodbye, {friend}!” said {hero}.', '“See you tomorrow!”', '{step}, {step}, {step}, all the way home.'],
         ['It was time to go home.', '{hero} gave {friend} a [big|warm|gentle] hug goodbye.', '{step}, {step}, {step}, home again.'],
         ['“Bye-bye, {friend}!” [called|said] {hero}.', 'Then {hero} {move} home, slow and sleepy.']],
  hush: [['Everything was quiet and still.', '[Shh, shh, shh.|Hush, hush, hush.]'],
         ['{sound}, {sound}, went {soundSrc}, very softly now.', 'So quiet. So cozy.']],
  sleepy: [['{hero} gave a big, big yawn.', 'Then {he} {bed}.', 'Snuggle, snuggle, snug.'],
           ['{hero} gave a soft, sleepy yawn, yaaawn.', '{His} eyes felt heavy, and {he} {bed}.', 'Snuggle, snuggle, snuggle.'],
           ['{hero} was so, so sleepy, and {he} gave a great big yawn.', 'Then {he} {bed}.', 'Snuggle, snuggle, warm and snug.']],
  goodnight: [['Goodnight, {placeShort}.', 'Goodnight, {friend}.', 'Goodnight, {hero}.'],
              ['Goodnight, {countN}.', 'Goodnight, {friend}.', 'Goodnight, little {hero}, sleep tight.'],
              ['Sweet dreams, {hero}.', 'Sweet dreams, {friend}.', 'Goodnight, everyone.']],
  goodnightL: [['Goodnight, {placeShort}.', 'Goodnight, {hero}.', 'And goodnight, {listener}, sleep tight.'],
               ['Sweet dreams, {hero}.', 'Goodnight, {countN}.', 'Goodnight, {listener}, I love you.'],
               ['{hero} whispered, “Goodnight, {listener}.”', 'Goodnight, {placeShort}.', 'Goodnight, and sweet dreams.']],
};

const OPTIONAL = ['home', 'look', 'extraSight', 'lessonExtra', 'refrain', 'count', 'hush'];
const ORDER = ['intro', 'go', 'look', 'extraSight', 'meet', 'lesson1', 'lesson2', 'lesson3', 'lessonExtra', 'refrain', 'dusk', 'count', 'home', 'hush', 'sleepy', 'goodnight'];
const MOOD = { dusk: 'dusk', count: 'night', home: 'dusk', hush: 'night', sleepy: 'night', goodnight: 'night' };
const FRIEND_ON = new Set(['meet', 'lesson1', 'lesson2', 'lesson3', 'lessonExtra', 'refrain', 'dusk', 'count', 'home']);

function cleanName(s) {
  s = String(s || '').normalize('NFC').replace(/[^\p{L}\p{M}' \-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 20);
  return s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : '';
}
const capFirst = s => s.replace(/^([^\p{L}]*)(\p{L})/u, (m, a, b) => a + b.toLocaleUpperCase());

function fill(tpl, ctx, rng) {
  let s = tpl, guard = 0;
  while (/\[[^\[\]]*\]/.test(s) && guard++ < 20) s = s.replace(/\[([^\[\]]*)\]/, (m, body) => { const o = body.split('|'); return o[Math.floor(rng() * o.length)]; });
  for (let pass = 0; pass < 3 && /\{\w+\}/.test(s); pass++) {
    s = s.replace(/\{(\w+)\}/g, (m, k) => {
      let v = ctx[k];
      if (v === undefined || v === null) throw new Error('Unfilled slot {' + k + '} in: ' + tpl);
      if (Array.isArray(v)) v = v[Math.floor(rng() * v.length)];
      return String(v);
    });
  }
  return capFirst(s.replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1').trim());
}

function find(list, id) { return list.find(x => x.id === id) || null; }

function generate(opts) {
  const hero = find(HEROES, opts.hero), place = find(PLACES, opts.place), lesson = find(LESSONS, opts.lesson);
  if (!hero || !place || !lesson) throw new Error('Unknown pick');
  const seed = (Number(opts.seed) >>> 0) || newSeed();
  const rng = mulberry32(seed);
  const pick = a => a[Math.floor(rng() * a.length)];
  const listener = cleanName(opts.listener);
  const P = { he: { he: 'he', his: 'his', him: 'him' }, she: { he: 'she', his: 'her', him: 'her' } }[hero.p];

  const sights = place.sights.slice(); for (let i = sights.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [sights[i], sights[j]] = [sights[j], sights[i]]; }
  const fr = pick(place.friends), item = pick(place.items), build = pick(place.builds), food = pick(place.foods), wait = pick(place.wait);
  const friend = listener || fr[1];
  const ctx = {
    hero: hero.name, heroDesc: hero.desc, feature: hero.feature, step: hero.step, move: hero.move,
    he: P.he, He: capFirst(P.he), his: P.his, His: capFirst(P.his), him: P.him,
    placeFull: place.full, placeShort: place.short, placeTitle: place.title, sound: place.sound, soundSrc: place.src,
    sight1: sights[0], sight2: sights[1], sight3: sights[2], nightLine: place.night,
    count1: place.count[0], countN: place.count[1], countVerb: place.count[2],
    friend, friendIntro: listener ? 'a little friend named ' + listener : 'a little ' + fr[0] + ' named ' + fr[1],
    itemA: item[0], itemThe: item[1], itemBare: item[2], obstacle: pick(place.obstacles), buildA: build[0], buildThe: build[1],
    foodA: food[0], foodThe: food[1], bite: food[2], things: place.things, waitSee: wait[0], waitPay: wait[1],
    refrain: pick(lesson.refrain), listener: listener || null,
  };
  // pronoun placeholders inside data strings (bed, trait) get filled after picking
  ctx.trait = hero.trait.map(t => t);
  ctx.bed = hero.bed;

  const variant = pick(lesson.variants);
  const target = 9 + Math.floor(rng() * 4); // 9..12 pages
  const opt = OPTIONAL.slice(); for (let i = opt.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [opt[i], opt[j]] = [opt[j], opt[i]]; }
  const include = new Set(['intro', 'go', 'meet', 'lesson1', 'lesson2', 'lesson3', 'dusk', 'sleepy', 'goodnight']);
  if (hero.fearsDark) include.add('count'); // the tiny dragon always finds the stars are night-lights
  for (const o of opt) { if (include.size >= target) break; include.add(o); }

  const pages = [];
  for (const beat of ORDER) {
    if (!include.has(beat)) continue;
    let tpls;
    if (beat.startsWith('lesson') && beat !== 'lessonExtra') tpls = variant[+beat.slice(6) - 1];
    else if (beat === 'lessonExtra') tpls = pick(lesson.extra);
    else if (beat === 'count') tpls = hero.fearsDark ? pick(BEATS.countDark) : pick(BEATS.count);
    else if (beat === 'goodnight') tpls = pick(listener ? BEATS.goodnightL : BEATS.goodnight);
    else if (beat === 'dusk' && hero.fearsDark) tpls = pick(BEATS.dusk).slice(0, 2).concat(['{hero} felt a little worried about the dark.']);
    else tpls = pick(BEATS[beat]);
    const sentences = tpls.map(t => fill(t, ctx, rng));
    pages.push({ beat, text: sentences.join(' '), sentences, scene: { mood: MOOD[beat] || 'day', pose: (beat === 'sleepy' || beat === 'hush' || beat === 'goodnight') ? 'sleepy' : 'happy', friend: FRIEND_ON.has(beat), listenerFriend: !!listener } });
  }
  const title = fill(pick(lesson.titles), ctx, rng);
  return { v: VERSION, title, seed, hero: hero.id, place: place.id, lesson: lesson.id, listener, friend, friendKind: listener ? 'friend' : fr[0], pages };
}

const api = { VERSION, HEROES, PLACES, LESSONS, generate, newSeed, cleanName };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.StoryEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
