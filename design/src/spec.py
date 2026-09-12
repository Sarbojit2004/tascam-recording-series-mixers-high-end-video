"""The ten Model-series slides.

Same design system as the Sonicview set: eight mechanics, one branding rail, one
layout engine. What changes is the subject -- five products (Model 12, 16, 24,
2400 and the Studio Bridge) and a set that is far richer in real-room photography
than the Sonicview catalogue was.

`hero` interrupts the headline; where it sits on a white sweep it is matted to its
own silhouette, otherwise it is a hard-edged photo block. `band` is the full-bleed
lower photograph. `plates` is the indexed register.
"""

SPEC = {
"01": dict(
    name="01_model-series-recording",
    labels=("Model Series", "Five Desks"),
    head=("RECORD", "ING"),
    # VS-01 puts both flagships on one black ground, but carries TASCAM's model
    # names burned into the composite. Ruling 03 crops such captions; here they
    # cannot come off without destroying the comparison, so it goes to the
    # register (illegible at plate size) and a clean key visual leads instead.
    hero="M24-04", hero_mode="block",
    band="M16-03", band_mode="scene", band_pos="center",
    plates=["VS-01", "M12-02", "M16-04", "M24-05", "M2400-02", "BRIDGE-01", "M24-12"],
    cap_title=("Mixer, ", "recorder"),
    cap_body="Five desks that are not only desks. Each one is an analogue mixing "
             "surface, a multitrack recorder to SD card, and a USB interface in the "
             "same chassis &mdash; which is why none of them needs a computer to "
             "finish a session.",
    cap_meta="Above &mdash; Model 24",
    band_meta="Below &mdash; the series on black",
),
"02": dict(
    name="02_model-12-the-compact",
    labels=("Model 12", "Wood &amp; Steel"),
    head=("TWELVE", "IN"),
    hero="M12-01", hero_mode="cut",
    band="M12-06", band_mode="bbox", band_pos="center",
    plates=["M12-04", "M12-05", "M12-07", "M12-08", "M12-11",
            "M12-18", "M12-19", "M12-23"],
    cap_title=("The small ", "one"),
    cap_body="Ten inputs across a desk small enough to carry, with the same walnut "
             "cheeks and the same colour-coded knob rows as the larger boards. The "
             "rear carries the whole I/O on one panel rather than a loom.",
    cap_meta="Above &mdash; Model 12",
    band_meta="Below &mdash; Model 12, low",
),
"03": dict(
    name="03_model-12-sessions",
    labels=("In The Room", "Model 12"),
    head=("SESSI", "ONS"),
    # M12-22 has a technology wordmark composited into it; ruling 04 keeps those
    # in the register, so a clean frame from the same shoot leads.
    hero="M12-13", hero_mode="block",
    band="M12-16", band_mode="scene", band_pos="center",
    plates=["M12-03", "M12-09", "M12-10", "M12-12", "M12-22", "M12-14",
            "M12-15", "M12-17", "M12-20", "M12-21"],
    cap_title=("Where it ", "lives"),
    cap_body="TASCAM shot this desk in rooms rather than on a sweep &mdash; a home "
             "studio, a live take with two players, a streaming setup. The register "
             "below holds the rest of that shoot, plus the routing drawing and the "
             "software panel that go with it.",
    cap_meta="Above &mdash; a home studio",
    band_meta="Below &mdash; a live room",
),
"04": dict(
    name="04_model-16-between",
    labels=("Model 16", "Sixteen In"),
    head=("BETWE", "EN"),
    hero="M16-01", hero_mode="cut",
    band="M16-07", band_mode="bbox", band_pos="center",
    plates=["M16-02", "M16-05", "M16-06", "M16-09", "M16-10", "M16-14"],
    cap_title=("The middle ", "desk"),
    cap_body="Sixteen inputs, sitting between the compact 12 and the 24. Same "
             "master section, same walnut, same multitrack recorder &mdash; a "
             "wider bed rather than a different instrument.",
    cap_meta="Above &mdash; Model 16",
    band_meta="Below &mdash; Model 16, side",
),
"05": dict(
    name="05_model-24-twenty-four",
    labels=("Model 24", "Twenty-Four In"),
    head=("TWENTY", "FOUR"),
    hero="M24-10", hero_mode="cut",
    band="M24-06", band_mode="bbox", band_pos="center",
    plates=["M24-03", "M24-07", "M24-08", "M24-09", "M24-11",
            "M24-13", "M24-15", "M24-16", "M24-17"],
    cap_title=("Twenty-four ", "up"),
    cap_body="The desk that put the series on stages. Twenty-four inputs, the same "
             "recorder, and enough front-panel real estate that a whole show can be "
             "run and captured from one surface.",
    cap_meta="Above &mdash; Model 24",
    band_meta="Below &mdash; Model 24, three-quarter",
),
"06": dict(
    name="06_model-2400-flagship",
    labels=("Model 2400", "The Largest"),
    head=("FLAGS", "HIP"),
    hero="M2400-01", hero_mode="cut",
    band="M2400-06", band_mode="bbox", band_pos="center",
    plates=["M2400-03", "M2400-05", "M2400-07", "M2400-08", "M2400-09",
            "M2400-12", "M2400-13", "M2400-15", "M2400-16"],
    cap_title=("The biggest ", "board"),
    cap_body="The top of the series, and the one that drops the walnut for a dark "
             "cabinet. A master bus processor sits in the gold section beside the "
             "recorder transport, which is the clearest difference from the 24.",
    cap_meta="Above &mdash; Model 2400",
    band_meta="Below &mdash; Model 2400, side",
),
"07": dict(
    name="07_studio-bridge",
    labels=("Studio Bridge", "Twenty-Four Track"),
    head=("STUDIO", "BRIDGE"),
    hero="BRIDGE-02", hero_mode="cut",
    band="BRIDGE-05", band_mode="bbox", band_pos="center",
    plates=["BRIDGE-03", "BRIDGE-04", "BRIDGE-06", "BRIDGE-07", "BRIDGE-08",
            "BRIDGE-09", "BRIDGE-10", "BRIDGE-11", "BRIDGE-13", "BRIDGE-17"],
    cap_title=("Not a ", "mixer"),
    cap_body="The one box in the series with no faders. It takes twenty-four "
             "channels off an existing console on D-sub, records them, and hands "
             "them back &mdash; so a studio keeps the desk it already has and gains "
             "a recorder behind it.",
    cap_meta="Above &mdash; Studio Bridge",
    band_meta="Below &mdash; Studio Bridge, side",
),
"08": dict(
    name="08_the-surface",
    labels=("Control Surface", "By Hand"),
    head=("SURFA", "CE"),
    # same ruling: M2400-14 carries the composited wordmark, so the clean knob
    # macro leads and that frame drops into the register.
    hero="M16-08", hero_mode="block",
    band="M24-02", band_mode="scene", band_pos="center",
    plates=["M2400-14", "M16-11", "M16-12", "M16-13", "M16-15",
            "M24-01", "M24-14", "M2400-04", "M2400-10"],
    cap_title=("Knobs, not ", "menus"),
    cap_body="One knob per function across the whole series &mdash; gain, three-band "
             "EQ, aux sends, all on the panel rather than three levels into a screen. "
             "The small display handles the recorder, not the mix.",
    cap_meta="Above &mdash; the input row",
    band_meta="Below &mdash; the fader bed",
),
"09": dict(
    name="09_the-routing",
    labels=("Rear Panel", "D-Sub 25pin"),
    head=("ROUTI", "NG"),
    hero="M2400-11", hero_mode="block",
    band="M24-18", band_mode="bbox", band_pos="center",
    plates=["BRIDGE-12", "BRIDGE-14", "BRIDGE-15", "BRIDGE-16",
            "BRIDGE-18", "BRIDGE-19", "BRIDGE-20", "BRIDGE-21"],
    cap_title=("Out the ", "back"),
    cap_body="Where the series stops being a mixer and starts being a hub. Main and "
             "sub outputs, aux sends, MIDI, footswitch, and on the Studio Bridge "
             "three D-sub 25-pin connectors carrying the whole twenty-four channels.",
    cap_meta="Above &mdash; Model 2400 rear",
    band_meta="Below &mdash; Model 24 rear",
),
"10": dict(
    name="10_model-series-studios",
    labels=("In Service", "Model 24"),
    head=("STUDI", "OS"),
    hero="CS24-03", hero_mode="block",
    band="CS24-01", band_mode="scene", band_pos="center",
    plates=["CS24-02", "CS24-04", "CS24-05", "M2400-17"],
    cap_title=("Rooms with ", "tape on them"),
    cap_body="The frames that were not shot on a sweep. A working room with the "
             "channel strip labelled in marker pen, outboard stacked beside the desk, "
             "and a band tracking live. Wear, cabling and lighting are whatever the "
             "room had.",
    cap_meta="Above &mdash; tracking live",
    band_meta="Below &mdash; a working control room",
),
}

# per-image preparation overrides.
# White-sweep frames get a bounding-box trim so the product fills its plate; the
# rest (lifestyle, macros on dark, diagrams, screen captures) go in whole.
PREP = {k: dict(mode="bbox") for k in [
    "M12-04", "M12-05", "M12-07", "M12-08", "M12-19",
    "M16-06",
    "M24-07", "M24-08", "M24-09", "M24-11",
    "M2400-03", "M2400-05", "M2400-07", "M2400-08", "M2400-09",
    "BRIDGE-03", "BRIDGE-04", "BRIDGE-06", "BRIDGE-07", "BRIDGE-08",
]}
