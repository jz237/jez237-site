#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include "sound-emulator-kit/6800.h"
static uint8_t rom[2048],ram[128],pia[4],command=255,dac=128;
uint8_t m6800_read(struct m6800*c,uint16_t a){if(a>=0xf800)return rom[a-0xf800];if(a<128)return ram[a];if(a==0x402){m6800_clear_interrupt(c,IRQ_IRQ1);return command;}if(a>=0x400&&a<0x404)return pia[a-0x400];return 255;}
uint8_t m6800_debug_read(struct m6800*c,uint16_t a){return m6800_read(c,a);}
void m6800_write(struct m6800*c,uint16_t a,uint8_t v){if(a<128)ram[a]=v;else if(a>=0x400&&a<0x404){if(a==0x400&&(pia[1]&4))dac=v;pia[a-0x400]=v;}}
void m6800_sci_change(struct m6800*c){}void m6800_tx_byte(struct m6800*c,uint8_t b){}void m6800_port_output(struct m6800*c,int p){}uint8_t m6800_port_input(struct m6800*c,int p){return 255;}void m68hc11_port_direction(struct m6800*c,int p){}void m68hc11_spi_begin(struct m6800*c,uint8_t o){}uint8_t m68hc11_spi_done(struct m6800*c){return 255;}
int main(int argc,char**argv){if(argc<5)return 1;FILE*f=fopen(argv[1],"rb");if(!f||fread(rom,1,2048,f)!=2048)return 2;fclose(f);int cmd=strtol(argv[2],0,0);double seconds=atof(argv[3]);f=fopen(argv[4],"wb");struct m6800 cpu={0};m6800_reset(&cpu,CPU_6800,0,INTIO_NONE);for(int n=0;n<1000;n++)m6800_execute(&cpu);command=(~cmd)&255;m6800_raise_interrupt(&cpu,IRQ_IRQ1);
double at[32];int codes[32],events=0,next=0;if(argc>5){char *item=strtok(argv[5],",");while(item&&events<32){sscanf(item,"%lf:%x",&at[events],&codes[events]);events++;item=strtok(NULL,",");}}
const double step=3579545.0/4/44100;double position=0,total=0;int samples=0;while(samples<(int)(seconds*44100)){if(next<events&&samples>=at[next]*44100){command=(~codes[next])&255;m6800_raise_interrupt(&cpu,IRQ_IRQ1);next++;}uint8_t prior=dac;int cycles=m6800_execute(&cpu);if(cycles<=0)cycles=1;double remain=cycles;while(remain>0){double take=step-position;if(take>remain)take=remain;total+=prior*take;position+=take;remain-=take;if(position>=step-1e-8){float v=(total/step-128)/128;fwrite(&v,4,1,f);samples++;position=total=0;}}}fclose(f);fprintf(stderr,"command=%02x samples=%d pc=%04x\n",cmd,samples,cpu.pc);return 0;}
