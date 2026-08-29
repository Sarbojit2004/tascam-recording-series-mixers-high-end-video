#!/usr/bin/env python3
import os,sys,math
from PIL import Image,ImageDraw
d=sys.argv[1]; out=sys.argv[2]; per=int(sys.argv[3]) if len(sys.argv)>3 else 24
fs=sorted(os.listdir(d))
for page in range(math.ceil(len(fs)/per)):
    chunk=fs[page*per:(page+1)*per]
    C=4; TW,TH=470,290
    R=math.ceil(len(chunk)/C)
    sh=Image.new("RGB",(C*TW,R*(TH+24)),(6,6,8)); dr=ImageDraw.Draw(sh)
    for i,f in enumerate(chunk):
        im=Image.open(os.path.join(d,f)).convert("RGB"); im.thumbnail((TW-10,TH-10))
        x=(i%C)*TW+5; y=(i//C)*(TH+24)+5
        sh.paste(im,(x,y))
        dr.text((x,(i//C)*(TH+24)+TH+4), f.replace(".png",""), fill=(170,178,188))
    p=f"{out}-{page+1}.png"; sh.save(p); print(p, sh.size, len(chunk))
