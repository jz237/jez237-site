/* Stable ten-surface residency. Selection is independent of draw order and
 * camera rotation; an outgoing surface fades before its slot is reused. */
#define ND_SLOTS 18
typedef struct {int key;float weight;} nd_resident;
typedef struct {int key;float score;} nd_choice;
static nd_resident nd_residents[ND_SLOTS];
static nd_choice nd_choices[ND_SLOTS];
static int nd_choice_count;
static float nd_smooth(float value){value=fmaxf(0,fminf(1,value));return value*value*(3-2*value);}
static float nd_distance_fade(float distance){return 1-nd_smooth((distance-44)/32);}
static int nd_resident_index(int key){for(int i=0;i<ND_SLOTS;i++)if(nd_residents[i].key==key)return i;return -1;}
static void nd_consider(int key,float distance){
    if(nd_resident_index(key)>=0)distance*=.82f;
    int at=0;while(at<nd_choice_count&&(nd_choices[at].score<distance||(nd_choices[at].score==distance&&nd_choices[at].key<key)))at++;
    if(at>=ND_SLOTS)return;
    if(nd_choice_count<ND_SLOTS)nd_choice_count++;
    for(int i=nd_choice_count-1;i>at;i--)nd_choices[i]=nd_choices[i-1];
    nd_choices[at]=(nd_choice){key,distance};
}
static void nd_choose_step(float dt){
    float step=fmaxf(0,fminf(.05f,dt))/.28f;
    for(int i=0;i<ND_SLOTS;i++){
        nd_resident *r=&nd_residents[i];if(!r->key)continue;
        int wanted=0;for(int j=0;j<nd_choice_count;j++)if(nd_choices[j].key==r->key)wanted=1;
        r->weight=fmaxf(0,fminf(1,r->weight+(wanted?step:-step)));
        if(!wanted&&r->weight==0)r->key=0;
    }
    for(int j=0;j<nd_choice_count;j++)if(nd_resident_index(nd_choices[j].key)<0){
        for(int i=0;i<ND_SLOTS;i++)if(!nd_residents[i].key){nd_residents[i]=(nd_resident){nd_choices[j].key,0};break;}
    }
}
static float nd_residency(int key){int i=nd_resident_index(key);return i<0?0:nd_smooth(nd_residents[i].weight);}
