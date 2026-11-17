/**
 * Text written for the guided tours. A tour stop uses the note for its system or piece when one exists here and
 * falls back to the opening of the piece's description otherwise.
 *
 * These are short teaching notes of well-established anatomy, written for this page. They are not clinical advice.
 * Counts of pieces are not stated here: the studio adds them from manifest.json.
 */

/** Whole-body tour: one note per system file. */
export const systemNotes = {
  skeletal: 'The frame everything else hangs from. An adult skeleton has about 206 bones: the axial skeleton (skull, spine, ribs and sternum) protects the brain, cord and chest organs, and the limbs attach to it through the shoulder and pelvic girdles. In the exploded view the bones barely move, so they are the reference for where everything else belongs.',
  joints: 'Ligaments tie bone to bone and limit how far a joint can move; discs and menisci of fibrocartilage sit between bones as cushions. The intervertebral discs alone make up roughly a quarter of the length of the spine.',
  visceral: 'The organs of the chest, abdomen and pelvis: the airways and lungs, the digestive tract from mouth to rectum with the liver and pancreas, the kidneys and bladder, and the glands. Most of them are soft, mobile and held in place by folds of membrane rather than by bone.',
  heart: 'A muscular pump about the size of a fist, sitting slightly left of the midline between the lungs. The right side sends blood to the lungs and the left side sends it to the rest of the body, with four valves keeping the flow one-way.',
  vessels: 'Arteries (red) carry blood away from the heart and veins (blue) bring it back. The aorta arches over the heart and runs down in front of the spine, giving off a branch for every organ and limb; the veins largely retrace the same routes in reverse.',
  brain: 'The brain, its coverings and the organs of special sense. The folded cerebral hemispheres sit on top, the cerebellum tucks in behind and below, and the brainstem connects both to the spinal cord. The eye and the inner ear are shown here too, because they develop with and wire directly into the brain.',
  nerves: 'Twelve pairs of cranial nerves leave the brain and thirty-one pairs of spinal nerves leave the cord. In the limbs the spinal nerves merge into plexuses and then into the long named nerves, of which the sciatic nerve is the thickest in the body.',
  muscular: 'Skeletal muscle is the body’s largest tissue by mass. Each muscle crosses at least one joint and can only pull, so muscles work in opposing groups. Superficial muscles travel farther than deep ones when the body is exploded, which is why they peel away in layers.',
  lymphoid: 'The lymphatic system returns tissue fluid to the blood and houses much of the immune system. Lymph nodes cluster where vessels converge (neck, armpits, groin, around the gut), and the spleen, thymus and tonsils are its larger organs.',
  regions: 'The skin, divided into the named surface regions that anatomists use to say where something is. It is the body’s largest organ, and it is drawn translucent here so the structures beneath stay visible.'
};

/** Study tours: notes keyed by the piece's name in the model. */
export const pieceNotes = {
  // heart
  'Right atrium': 'The receiving chamber for blood returning from the body. The superior and inferior venae cavae empty into it, along with the coronary sinus, which drains the heart’s own muscle. It passes blood through the tricuspid valve to the right ventricle.',
  'Left ventricle': 'The strongest chamber of the heart. Its wall is about three times as thick as the right ventricle’s because it has to push blood through the aortic valve to the whole body rather than just to the lungs.',
  'Aortic arch': 'The bend where the aorta turns from rising to descending. Three branches leave its top: the brachiocephalic trunk, the left common carotid artery and the left subclavian artery, supplying the head, neck and arms.',
  'Pulmonary trunk': 'The outflow of the right ventricle. It carries oxygen-poor blood and divides beneath the aortic arch into the right and left pulmonary arteries, one for each lung. It is coloured blue here for that reason, even though it is an artery.',
  'Anterior interventricular artery': 'A branch of the left coronary artery that runs down the front of the heart in the groove between the two ventricles, supplying much of the left ventricle and the septum. Clinicians often call it the left anterior descending artery.',
  // lungs
  'Trachea': 'The windpipe: a tube held open by C-shaped rings of cartilage, running from the larynx down to the level of the sternal angle, where it divides into the right and left main bronchi.',
  'Middle lobe of right lung': 'The right lung has three lobes and the left has two, because the heart takes up room on the left. The middle lobe is the small wedge at the front of the right lung, between the horizontal and oblique fissures.',
  'Pleura': 'A thin double membrane. One layer coats the lung and the other lines the chest wall, with a film of fluid between them, so the lung can slide as it expands while staying held against the chest wall.',
  // spine
  'Atlas (C1)': 'The first cervical vertebra, a ring with no body. The skull rests on it, and the joint between them allows nodding. It turns as a unit with the skull around the peg of the axis below, which allows the head to rotate.',
  'Vertebra C7': 'The last cervical vertebra. Its long spinous process is usually the most prominent bump at the base of the neck, which makes it a useful landmark for counting vertebrae.',
  'Vertebra T12': 'The last thoracic vertebra and the last to carry ribs. It is transitional: its upper joints face like a thoracic vertebra’s and its lower joints like a lumbar vertebra’s.',
  'Vertebra L5': 'The lowest lumbar vertebra and the largest, since it carries the weight of everything above. It sits on the sacrum at an angle, which is one reason the joint below it is a common site of back trouble.',
  'Sacrum': 'Five vertebrae fused into one wedge-shaped bone. It locks between the two hip bones at the sacro-iliac joints and passes the weight of the upper body to the pelvis and legs.',
  'White matter of spinal cord': 'The outer part of the cord, made of bundled nerve fibres running up to and down from the brain. The cord itself ends around the level of the first or second lumbar vertebra in adults; below that the canal holds nerve roots.',
  'Anterior longitudinal ligament': 'A broad band running down the front of the vertebral bodies and discs from the skull base to the sacrum. It limits how far the spine can bend backwards.',
  // brain
  'Superior frontal gyrus': 'The uppermost of the ridges on the frontal lobe, running front to back alongside the midline. The frontal lobes as a whole handle planning, voluntary movement and much of what is called personality.',
  'Occipital pole': 'The rearmost tip of the cerebral hemisphere. The primary visual cortex lies around it, so what the eyes see is first processed at the very back of the head.',
  'Pons': 'The bulging middle part of the brainstem, between the midbrain and the medulla. It relays signals between the cerebrum and the cerebellum and contains the nuclei of several cranial nerves.',
  'Corpus callosum': 'The largest bundle of fibres in the brain: a thick band connecting the left and right cerebral hemispheres so the two sides can share information.',
  'Thalamus': 'A paired mass of grey matter deep in the centre of the brain. Almost all sensory information on its way to the cortex passes through it, which is why it is often described as a relay station.',
  'Lateral ventricle': 'One of the fluid-filled cavities inside the brain, one in each hemisphere. The choroid plexus in the ventricles produces cerebrospinal fluid, which cushions the brain and cord.',
  // skull
  'Frontal bone': 'The bone of the forehead. It also forms the roof of each eye socket and contains the frontal sinuses above the brows.',
  'Parietal bone': 'A pair of curved plates forming most of the roof and sides of the skull. They meet each other at the sagittal suture along the top of the head.',
  'Temporal bone': 'The bone at the side of the skull around the ear. It houses the middle and inner ear, and its mastoid process is the bump behind the earlobe.',
  'Maxilla': 'The upper jaw. The two maxillae hold the upper teeth, form most of the hard palate and the floor of the eye sockets, and each contains a large maxillary sinus.',
  'Mandible': 'The lower jaw and the only freely movable bone of the skull. It hinges with the temporal bones at the temporomandibular joints, just in front of the ears.',
  'Sphenoid bone': 'A butterfly-shaped bone in the middle of the skull base. It touches almost every other bone of the cranium, and the pituitary gland sits in a saddle-shaped hollow on its upper surface.',
  'Malleus': 'The hammer: the first of the three tiny bones of the middle ear. It is attached to the eardrum and passes vibrations on to the incus and then the stapes.',
  // eye
  'Cornea': 'The clear front window of the eye. It does most of the eye’s focusing, more than the lens, because light bends most where it passes from air into the cornea.',
  'Iris': 'The coloured ring of muscle around the pupil. It narrows the pupil in bright light and widens it in dim light, controlling how much light reaches the retina.',
  'Lens': 'A clear, flexible disc behind the iris. Muscles around it change its shape to fine-tune focus between near and far objects; it stiffens with age, which is why reading glasses become necessary.',
  'Vitreous body': 'The clear gel that fills the large chamber behind the lens and keeps the eyeball in shape.',
  'Retina': 'The light-sensitive lining at the back of the eye. Its rods and cones convert light into nerve signals, which leave the eye through the optic nerve.',
  'Sclera': 'The white of the eye: a tough fibrous coat that protects the eyeball and gives the eye muscles something to attach to.',
  // hand
  'Scaphoid bone': 'A boat-shaped carpal bone on the thumb side of the wrist. It is the carpal bone most often broken, typically in a fall onto an outstretched hand.',
  'Capitate bone': 'The largest of the eight carpal bones, sitting in the centre of the wrist in line with the middle finger.',
  'First metacarpal bone': 'The bone at the base of the thumb. Its saddle-shaped joint with the wrist lets the thumb swing across the palm to meet the fingers.',
  'Abductor pollicis brevis': 'One of the short muscles forming the fleshy pad at the base of the thumb. It lifts the thumb away from the palm.',
  // knee
  'Femur': 'The thigh bone, the longest and strongest bone in the body. Its two rounded condyles at the lower end roll and glide on the top of the tibia.',
  'Patella': 'The kneecap, the largest sesamoid bone in the body. It sits within the quadriceps tendon and improves the leverage of the thigh muscles as they straighten the knee.',
  'Anterior cruciate ligament': 'One of two ligaments that cross inside the knee. It stops the tibia sliding forwards under the femur and is commonly torn in twisting sports injuries.',
  'Lateral meniscus': 'A C-shaped pad of fibrocartilage on the outer side of the knee. Together with the medial meniscus it deepens the joint and spreads load across it.',
  'Medial meniscus': 'The crescent of fibrocartilage on the inner side of the knee. It is attached to the joint capsule and so moves less than the lateral meniscus, which makes it the one more often torn.',
  'Tibia': 'The shin bone, the weight-bearing bone of the lower leg. Its flat upper surface forms the lower half of the knee joint.',
  // rib cage
  'Manubrium of sternum': 'The broad upper part of the breastbone. The collarbones and the first pair of ribs attach to it, and the notch at its top can be felt at the base of the throat.',
  'Body of sternum': 'The long middle part of the breastbone. It meets the manubrium at the sternal angle, a ridge level with the second rib that is used as the starting point for counting ribs.',
  'First rib': 'The shortest, flattest and most curved rib. The vessels and nerves to the arm pass over it on their way out of the chest.',
  'Seventh rib': 'The last of the true ribs, which are the seven pairs that reach the sternum through their own cartilage.',
  'Twelfth rib': 'A floating rib. The last two pairs of ribs end in the muscle of the abdominal wall and do not connect to the sternum at all.',
  // digestive
  'Tongue': 'A mass of muscle that moves food around the mouth, starts the swallow and carries the taste buds.',
  'Oesophagus': 'A muscular tube about 25 cm long that carries food from the throat to the stomach by waves of contraction, passing through the diaphragm on the way.',
  'Stomach': 'A muscular bag that churns food with acid and enzymes, then releases it a little at a time into the small intestine.',
  'Pancreas': 'A gland lying behind the stomach. It releases digestive enzymes into the duodenum and the hormones insulin and glucagon into the blood.',
  'Jejunum': 'The middle part of the small intestine, where most nutrients are absorbed.',
  'Transverse colon': 'The part of the large intestine that crosses the abdomen from right to left, below the stomach.',
  'Sigmoid colon': 'The S-shaped last stretch of the colon, leading into the rectum.',
  // urinary
  'Kidney': 'A bean-shaped organ on each side of the spine, behind the other abdominal organs. The kidneys filter the blood, removing waste and excess water as urine.',
  'Renal pelvis': 'The funnel inside the kidney that collects urine and narrows into the ureter.',
  'Suprarenal gland': 'The adrenal gland, sitting on top of each kidney. It is not part of the urinary system: it makes hormones including adrenaline and cortisol.',
  'Ureter': 'A narrow muscular tube, about 25 cm long, that carries urine from each kidney down to the bladder.',
  'Urinary bladder': 'A muscular reservoir in the pelvis that stores urine until it is released.',
  'Urethra': 'The tube that carries urine from the bladder out of the body.',
  // aorta
  'Ascending aorta': 'The first part of the aorta, rising from the left ventricle. The two coronary arteries that supply the heart itself branch off just above the aortic valve.',
  'Thoracic aorta': 'The part of the descending aorta that runs down through the chest, just in front and to the left of the spine.',
  'Coeliac trunk': 'The first major branch of the abdominal aorta. It supplies the stomach, liver, spleen and part of the pancreas.',
  'Abdominal aorta': 'The aorta below the diaphragm. It gives off branches to the gut and the kidneys, then divides into the two common iliac arteries at about the level of the navel.',
  'Common iliac artery': 'One of the two end branches of the aorta. Each divides again into an internal iliac artery for the pelvis and an external iliac artery for the leg.',
  // pelvis
  'Hip bone': 'Each hip bone is three bones (ilium, ischium and pubis) fused together. All three meet at the acetabulum, the socket for the head of the femur.',
  'Coccyx': 'The tailbone: a few small fused vertebrae at the very end of the spine.',
  // shoulder
  'Scapula': 'The shoulder blade, a flat triangular bone on the back of the rib cage. It is held in place almost entirely by muscle, which gives the shoulder its large range of movement.',
  'Clavicle': 'The collarbone. It acts as a strut that holds the shoulder out to the side and is the only bony link between the arm and the trunk.',
  'Humerus': 'The bone of the upper arm. Its rounded head sits in the shallow socket of the scapula, forming the most mobile joint in the body.',
  'Supraspinatus muscle': 'One of the four rotator cuff muscles. It runs along the top of the scapula and starts the movement of lifting the arm away from the side.',
  'Infraspinatus muscle': 'A rotator cuff muscle covering the back of the scapula below its spine. It rotates the arm outwards.',
  'Subscapularis muscle': 'The rotator cuff muscle on the front of the scapula, against the ribs. It rotates the arm inwards.',
  // larynx
  'Hyoid bone': 'A U-shaped bone in the front of the neck that does not touch any other bone. It is suspended by muscles and ligaments and anchors the tongue above and the larynx below.',
  'Epiglottis': 'A leaf-shaped flap of elastic cartilage that folds over the entrance of the larynx during swallowing, directing food towards the oesophagus.',
  'Thyroid cartilage': 'The largest cartilage of the larynx. Its two plates meet at the front to form the laryngeal prominence, the Adam’s apple.',
  'Cricoid cartilage': 'A signet-ring-shaped cartilage below the thyroid cartilage and the only complete ring of cartilage in the airway.',
  'Arytenoid cartilage': 'A pair of small pyramids sitting on the back of the cricoid. The vocal cords attach to them, and their movement opens, closes and tenses the cords.',
  'Thyroid gland': 'A butterfly-shaped gland wrapped around the front of the trachea just below the larynx. Its hormones set the body’s metabolic rate.',
  // foot
  'Talus': 'The ankle bone. It sits between the leg bones above and the heel bone below and passes the whole weight of the body to the foot. No muscles attach to it.',
  'Calcaneus': 'The heel bone, the largest bone in the foot. The Achilles tendon attaches to its back surface.',
  'Navicular bone': 'A boat-shaped bone on the inner side of the foot, at the top of the arch.',
  'First metatarsal bone': 'The short, thick bone leading to the big toe. Its head forms the ball of the foot and takes a large share of the load when pushing off.',
  // face
  'Temporalis muscle': 'A fan-shaped chewing muscle covering the temple. It closes the jaw and pulls it back.',
  'Zygomaticus major muscle': 'The muscle that pulls the corner of the mouth up and out. It is the main muscle of smiling.',
  'Orbicularis oris muscle': 'The ring of muscle around the mouth. It closes and purses the lips.',
  'Bucinator': 'The muscle of the cheek. It presses the cheek against the teeth, keeping food between them during chewing.'
};
