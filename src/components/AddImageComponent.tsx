import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Image, Upload, Users, Smile, Cloud, Star, Heart, Flame } from "lucide-react";

interface AddImageComponentProps {
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
}

const AddImageComponent = ({
  onImageSelect
}: AddImageComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          onImageSelect(event.target.result as string, 'sticker');
          setIsOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    // Convert emoji to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    if (ctx) {
      ctx.font = '80px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 50, 50);
      const dataURL = canvas.toDataURL();
      onImageSelect(dataURL, 'emoji');
      setIsOpen(false);
    }
  };

  const handleStickerSelect = (sticker: string) => {
    // Convert sticker to image for use in meme
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 120;
    if (ctx) {
      ctx.font = '100px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sticker, 60, 60);
      const dataURL = canvas.toDataURL();
      onImageSelect(dataURL, 'sticker');
      setIsOpen(false);
    }
  };

  const emojiCategories = [{
    name: 'Human',
    icon: Users,
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
  }, {
    name: 'Animals',
    icon: Heart,
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🪲', '🪳', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦣', '🦏', '🦛', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫']
  }, {
    name: 'Reactions',
    icon: Smile,
    emojis: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤝', '👐', '🤲', '🤜', '🤛', '✊', '👊', '🫳', '🫴', '👂', '🦻', '👃', '🫀', '🫁', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸']
  }, {
    name: 'Planets & Space',
    icon: Star,
    emojis: ['🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛴', '🚲', '🛺', '🚁', '🚟', '🚠', '🚡', '🛩️', '✈️', '🛫', '🛬', '🪂', '💺', '🛰️', '🚀', '🛸', '🚁', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚨', '🚥', '🚦', '🛑', '🚏', '🌟', '⭐', '💫', '✨', '☄️', '🌠', '🌌', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌊', '💧', '💦', '☔']
  }, {
    name: 'Fire & Elements',
    icon: Flame,
    emojis: ['🔥', '💥', '💫', '💢', '💯', '💨', '🌪️', '🌊', '💧', '💦', '☔', '⛈️', '🌩️', '⚡', '🔆', '🔅', '💡', '🔦', '🕯️', '🪔', '🔥', '💥', '💫', '⭐', '🌟', '💫', '✨', '🌠', '☄️', '🌌', '🌈', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '❄️', '☃️', '⛄', '🌬️', '🌪️', '🌊', '💧', '💦', '☔', '⛈️', '🌩️', '⚡']
  }, {
    name: 'Clouds & Weather',
    icon: Cloud,
    emojis: ['☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌈', '☔', '💧', '💦', '🌊']
  }, {
    name: 'Symbols & Objects',
    icon: Star,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '⚪', '⚫', '🔴', '🔵', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '⬛', '⬜', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  }];

  const stickmanPoses = ['🚶', '🏃', '🧍', '🤸', '🤾', '🏌️', '🏄', '🚣', '🏊', '⛹️', '🏋️', '🚴', '🤺', '🏇', '⛷️', '🏂', '🤸', '🤼', '🤽', '🧘', '🛀', '🛌', '🕴️', '💃', '🕺', '👯', '🧖', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🦸', '🦹', '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰', '🤵', '👸', '🤴', '🥷', '🤱', '🤰', '🙇', '💁', '🙅', '🙆', '🙋', '🤦', '🤷', '🙎', '🙍', '💇', '💆', '🧏', '🤷', '🤦', '🙋', '🙅', '🙆', '💁', '🙇', '🤰', '🤱', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '👨‍🦱', '👩‍🦰', '👨‍🦰', '👱', '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲', '🧔', '🧓', '👴', '👵', '🙈', '🙉', '🙊', '💥', '💫', '💦', '💨', '🕳️', '💣', '💤'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:from-pink-600 hover:to-purple-600 text-xs px-2 h-8">
          <Image className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Image</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-pink-500" />
            Add Images, Emojis & Stickers
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="emojis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emojis">Emojis</TabsTrigger>
            <TabsTrigger value="stickman">Stickman</TabsTrigger>
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emojis" className="space-y-4 max-h-96 overflow-y-auto">
            {emojiCategories.map(category => (
              <div key={category.name}>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {category.emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="stickman" className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Human Stickman Poses</h4>
              <div className="grid grid-cols-8 gap-2 max-h-80 overflow-y-auto">
                {stickmanPoses.map(pose => (
                  <button
                    key={pose}
                    onClick={() => handleStickerSelect(pose)}
                    className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {pose}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stickers" className="space-y-4">
            <div className="space-y-6">
              <div className="text-center py-6">
                <Badge className="bg-pink-500 text-white mb-4">Create Custom Stickers</Badge>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Sticker Creator</h3>
                <p className="text-gray-600 mb-4">Upload your own images to create custom stickers for your memes</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Upload Your Object</h4>
                  <p className="text-gray-600 mb-4">Upload any image to use as a sticker object</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    id="sticker-upload" 
                  />
                  <label htmlFor="sticker-upload">
                    <Button className="cursor-pointer bg-pink-600 hover:bg-pink-700">
                      Choose File
                    </Button>
                  </label>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Badge variant="secondary">PNG, JPG supported</Badge>
                  <Badge variant="secondary">Max 10MB</Badge>
                  <Badge variant="secondary">Auto-resize to sticker</Badge>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Quick Stickman Selection</h4>
                <div className="grid grid-cols-6 gap-3">
                  {stickmanPoses.slice(0, 12).map(pose => (
                    <button
                      key={pose}
                      onClick={() => handleStickerSelect(pose)}
                      className="text-3xl p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      {pose}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Your Image</h3>
              <p className="text-gray-600 mb-4">Add your own images to use as objects in your meme</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="add-image-upload" 
              />
              <label htmlFor="add-image-upload">
                <Button className="cursor-pointer bg-pink-600 hover:bg-pink-700">
                  Choose File
                </Button>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Badge variant="secondary">JPG, PNG supported</Badge>
              <Badge variant="secondary">Max 10MB</Badge>
              <Badge variant="secondary">Copyright-free</Badge>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddImageComponent;
