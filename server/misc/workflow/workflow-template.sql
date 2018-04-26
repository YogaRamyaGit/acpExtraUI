/* The file contains workflow configuration for <PARTNER> <FEED> workflow */

/* Cleanup staging tables for workflow */
CALL acp_wf_metadata_stg.sp_delete_task_config_stg('W_<PARTNER>_<FEED>', @cd, @msg);
CALL acp_wf_metadata_stg.sp_delete_task_stg('W_<PARTNER>_<FEED>', @cd, @msg);
CALL acp_wf_metadata_stg.sp_delete_workflow_stg('W_<PARTNER>_<FEED>', @cd, @msg);

/* workflow details */
INSERT INTO acp_wf_metadata_stg.workflow(workflow_name, workflow_desc, data_partner_cd, feed_type_cd)
    VALUES ('W_<PARTNER>_<FEED>', 'Workflow for <PARTNER> <FEED> Feed', '<PARTNER>', '<FEED>');

/* task details */
#The move set task moves control and <feed>, all together. Still all of them fall into the
#general <feed>brella of <feed>. So setting the data type name of the moveset task to PEGASUS-<feed>
INSERT IGNORE INTO acp_wf_metadata_stg.task (workflow_name, task_type_name, data_type_name, task_name, task_command, seq_no, is_active)
  VALUES ('W_<PARTNER>_<FEED>', 'FS', 'PEGASUS-<FEED>', '<partner>_<feed>_ext_s3_to_edt_s3_<feed>', 'move', 1, 1);
INSERT INTO acp_wf_metadata_stg.task(task_name, workflow_name, task_type_name, data_type_name, task_command, seq_no, is_active)
  VALUES ('<partner>_<feed>_run_acp_extra_<feed>', 'W_<PARTNER>_<FEED>', 'SHELL', 'PEGASUS-<FEED>', 'exec_shell', 2, 1);
INSERT INTO acp_wf_metadata_stg.task(task_name, workflow_name, task_type_name, data_type_name, task_command, seq_no, is_active)
  VALUES ('<partner>_<feed>_load_edt_s3_to_lz', 'W_<PARTNER>_<FEED>', 'PLUGIN', 'PEGASUS-<FEED>', 'upload_to_lz', 3, 1);
INSERT INTO acp_wf_metadata_stg.task(task_name, workflow_name, task_type_name, data_type_name, task_command, seq_no, is_active)
  VALUES ('<partner>_<feed>_load_from_lz_to_ods', 'W_<PARTNER>_<FEED>', 'DB', 'PEGASUS-<FEED>', 'exec_sql', 4, 1);
INSERT INTO acp_wf_metadata_stg.task(task_name, workflow_name, task_type_name, data_type_name, task_command, seq_no, is_active)
  VALUES ('<partner>_<feed>_archive_processed_data', 'W_<PARTNER>_<FEED>', 'FS', 'PEGASUS-<FEED>', 'move', 5, 1);
INSERT INTO acp_wf_metadata_stg.task(task_name, workflow_name, task_type_name, data_type_name, task_command, seq_no, is_active)
  VALUES ('<partner>_<feed>_archive_raw_data', 'W_<PARTNER>_<FEED>', 'FS', 'PEGASUS-<FEED>', 'move', 6, 1);

/* task config details */

# Configure task config table
# Step 1: Move data from ext s3 to edt s3
# the task name for this will be the same as task in step 2
/* Task : <feed>r_medclm_ext_s3_to_edt_s3_control*/
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_ext_s3_to_edt_s3_<feed>', 'source', '<EXT_PARTNER_BUCKET>/.*txt');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_ext_s3_to_edt_s3_<feed>', 'destination', '<EDT_INPROCESS_BUCKET>/<WORKFLOW_RUN_ID>/');


/* Task : <partner>_<feed>_run_acp_extra_medclm */
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_run_acp_extra_<feed>', 'command_string', 'export SPARK_YARN_USER_ENV=PYTHONHASHSEED=0;export PYSPARK_PYTHON=python3;export PYTHONPATH=$PYTHONPATH:/etc/pegasus/acp-ExTra;python3 /etc/pegasus/acp-ExTra/acp_extra/__main__.py --workflow_run_id <WORKFLOW_RUN_ID> --config_file <partner>_<feed>.cfg');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_run_acp_extra_<feed>', 'working_directory','/etc/pegasus/acp-ExTra');

/* Task : <partner>_<feed>_load_edt_s3_to_lz */
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_edt_s3_to_lz', 'connection', 'ACP_LZ');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_edt_s3_to_lz', 'database', 'AURORA');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
  VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_edt_s3_to_lz', 'mappings', '<TABLES>');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_edt_s3_to_lz', 'cleanup_proc', 'lz_cleanup_table');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_edt_s3_to_lz', 'type', 'PREFIX');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_edt_s3_to_lz', 'delimiter', '0x08');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_edt_s3_to_lz', 'workflow_run_id', '<WORKFLOW_RUN_ID>');

/* Task : <partner>_<feed>_load_from_lz_to_ods */
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_from_lz_to_ods', 'connection', 'ACP_ODS');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_from_lz_to_ods', 'database', 'AURORA');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_from_lz_to_ods', 'type', 'stored_procedure');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_from_lz_to_ods', 'query', 'sp_populate_all_<feed>_tbls');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_load_from_lz_to_ods', 'stored_procedure_parameters', '<WORKFLOW_RUN_ID>,0,0');

/* Task : <partner>_<feed>_archive_processed_data */
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_archive_processed_data', 'source', '<EDT_PROCESSED_BUCKET>/*');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_archive_processed_data', 'destination', '<EDT_ARCHIVE_BUCKET>/processed/');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_archive_processed_data', 'skip_exec', 'false');

/* Task : <partner>_<feed>_archive_raw_data */
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_archive_raw_data', 'source', '<EDT_INPROCESS_BUCKET>/*');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_archive_raw_data', 'destination', '<EDT_ARCHIVE_BUCKET>/raw/');
INSERT INTO acp_wf_metadata_stg.task_config(workflow_name, task_name, task_parameter_name, task_parameter_value)
    VALUES ('W_<PARTNER>_<FEED>', '<partner>_<feed>_archive_raw_data', 'skip_exec', 'false');

call acp_wf_metadata.sp_move_workflow_stg_target('W_<PARTNER>_<FEED>', @cd, @msg);
SELECT @cd, @msg;
