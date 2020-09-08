<?php
$action_1 = $_POST['action_1'];
$action_2 = $_POST['action_2'];

if ($action_1 == 'update')
{
	if($action_2 == 'add_key'){
		if(!empty($_POST['iscreen_key'])){
			$ISCREEN_KEY = $_POST['iscreen_key'];
			$sql = "INSERT INTO `llx_user` (`rowid`, `entity`, `ref_ext`, `ref_int`, `employee`, `fk_establishment`, `datec`, `tms`, `fk_user_creat`, `fk_user_modif`, `login`, `pass`, `pass_crypted`, `pass_temp`, `api_key`, `gender`, `civility`, `lastname`, `firstname`, `address`, `zip`, `town`, `fk_state`, `fk_country`, `job`, `skype`, `office_phone`, `office_fax`, `user_mobile`, `personal_mobile`, `email`, `personal_email`, `socialnetworks`, `signature`, `admin`, `module_comm`, `module_compta`, `fk_soc`, `fk_socpeople`, `fk_member`, `fk_user`, `fk_user_expense_validator`, `fk_user_holiday_validator`, `note_public`, `note`, `model_pdf`, `datelastlogin`, `datepreviouslogin`, `egroupware_id`, `ldap_sid`, `openid`, `statut`, `photo`, `lang`, `color`, `barcode`, `fk_barcode_type`, `accountancy_code`, `nb_holiday`, `thm`, `tjm`, `salary`, `salaryextra`, `dateemployment`, `dateemploymentend`, `weeklyhours`, `import_key`, `birth`, `pass_encoding`, `default_range`, `default_c_exp_tax_cat`, `twitter`, `facebook`, `instagram`, `snapchat`, `googleplus`, `youtube`, `whatsapp`, `linkedin`, `fk_warehouse`, `iplastlogin`, `ippreviouslogin`) 
					VALUES (NULL, '1', NULL, NULL, '1', '0', NULL, CURRENT_TIMESTAMP, NULL, NULL, 'iscreen', 'anexys1,', NULL, NULL, '".$ISCREEN_KEY."', NULL, NULL, 'iscreen', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);";
			$res = $db->query($sql);
			$db->commit();
		}else{
			?><script>alert("La clé licence ne paut pas etre vide!!");</script><?php
		}
	}

	if($action_2 == 'delete_key'){
		if(!empty($_POST['istock_key_d'])){
			$sql = "DELETE FROM llx_user where login = 'iscreen' AND lastname = 'iscreen'";
			$res = $db->query($sql);
			$db->commit();
			$ISCREEN_KEY = "";
		}
	}
	
}
?>