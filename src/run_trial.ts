import {
  set_trial_context,
  type StimBank,
  type TaskSettings,
  type TrialBuilder
} from "psyflow-web";

export function run_trial(
  trial: TrialBuilder,
  condition: string,
  context: {
    settings: TaskSettings;
    stimBank: StimBank;
    block_id: string;
    block_idx: number;
  }
): TrialBuilder {
  const { settings, stimBank, block_id, block_idx } = context;
  const [flanker_type, target_direction] = String(condition).split("_");
  const key_list = ((settings.key_list as string[]) ?? ["f", "j"]).map(String);
  const left_key = String(settings.left_key ?? "f");
  const right_key = String(settings.right_key ?? "j");
  const trigger_map = (settings.triggers ?? {}) as Record<string, unknown>;
  const correct_response = target_direction === "left" ? left_key : right_key;
  const condition_id = String(condition);

  trial.setTrialState("flanker_type", flanker_type);
  trial.setTrialState("target_direction", target_direction);
  trial.setTrialState("correct_response", correct_response);

  const fixationUnit = trial.unit("fixation").addStim(stimBank.get("fixation"));
  set_trial_context(fixationUnit, {
    trial_id: trial.trial_id,
    phase: "pre_stim_fixation",
    deadline_s: Number(settings.fixation_duration ?? 0.5),
    valid_keys: [...key_list],
    block_id,
    condition_id,
    task_factors: {
      condition: condition_id,
      stage: "pre_stim_fixation",
      flanker_type,
      target_direction,
      block_idx
    },
    stim_id: "fixation"
  });
  fixationUnit.show({ duration: Number(settings.fixation_duration ?? 0.5) }).to_dict();

  const stimulusUnit = trial.unit("stimulus").addStim(stimBank.get(condition_id));
  set_trial_context(stimulusUnit, {
    trial_id: trial.trial_id,
    phase: "flanker_response",
    deadline_s: Number(settings.stim_duration ?? 1),
    valid_keys: [...key_list],
    block_id,
    condition_id,
    task_factors: {
      condition: condition_id,
      stage: "flanker_response",
      flanker_type,
      target_direction,
      correct_key: correct_response,
      block_idx
    },
    stim_id: condition_id
  });
  stimulusUnit
    .captureResponse({
      keys: key_list,
      correct_keys: [correct_response],
      duration: Number(settings.stim_duration ?? 1),
      response_trigger: {
        [left_key]: Number(trigger_map.left_key_press ?? 30),
        [right_key]: Number(trigger_map.right_key_press ?? 31)
      },
      timeout_trigger: Number(trigger_map.response_timeout ?? 32),
      terminate_on_response: true
    })
    .to_dict();

  const itiUnit = trial.unit("iti");
  set_trial_context(itiUnit, {
    trial_id: trial.trial_id,
    phase: "iti",
    deadline_s: (settings.iti_duration as number | number[] | null | undefined) ?? null,
    valid_keys: [],
    block_id,
    condition_id,
    task_factors: {
      condition: condition_id,
      stage: "iti",
      flanker_type,
      target_direction,
      block_idx
    },
    stim_id: "blank_iti"
  });
  itiUnit.show({ duration: (settings.iti_duration as number | number[] | null | undefined) ?? null }).to_dict();

  return trial;
}
